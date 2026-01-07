import { downscaleFile } from "../utils/helpers";
import supabase from "./supabase";

const POSTS_BUCKET = "post-media";
const POST_TYPE = "post";

function ensureFile(candidate) {
  if (!candidate) throw new Error("Invalid media item.");
  if (candidate instanceof Blob) {
    const name =
      candidate?.name ?? `upload.${candidate.type?.split("/")[1] ?? "dat"}`;
    return new File([candidate], name, { type: candidate.type });
  }
  if (candidate instanceof File) return candidate;
  if (candidate?.file instanceof Blob) {
    const blob = candidate.file;
    const name =
      blob?.name ??
      candidate?.name ??
      `upload.${blob.type?.split("/")[1] ?? "dat"}`;
    return new File([blob], name, { type: blob.type });
  }
  if (candidate?.file instanceof File) return candidate.file;
  throw new Error("Media item is missing the underlying file.");
}

async function uploadMediaFile(publicationId, file, index) {
  const safeFile = ensureFile(file);
  const extension = safeFile.name?.split(".").pop() ?? "dat";
  const path = `${publicationId}/${Date.now()}-${index}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(POSTS_BUCKET)
    .upload(path, safeFile, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: publicUrlData, error: publicUrlError } = supabase.storage
    .from(POSTS_BUCKET)
    .getPublicUrl(path);
  if (publicUrlError) throw publicUrlError;
  const { publicUrl } = publicUrlData ?? {};
  if (!publicUrl) {
    throw new Error("Unable to generate public URL for uploaded media.");
  }

  return { path, publicUrl };
}

async function removeUploadedFiles(uploads) {
  if (!uploads?.length) return;
  const paths = uploads.map(({ path }) => path);
  await supabase.storage.from(POSTS_BUCKET).remove(paths);
}

export async function createPost({ caption, mediaItems, authorId }) {
  if (!authorId) throw new Error("You must be signed in to create a post.");
  if (!mediaItems?.length) {
    throw new Error("Select at least one photo or video before sharing.");
  }

  const optimizedMedia = await Promise.all(
    mediaItems.map(async (item) => {
      const original = ensureFile(item);
      if (!original?.type?.startsWith("image/")) return original;

      const scaled = await downscaleFile(original);
      if (scaled instanceof File) return scaled;
      if (scaled instanceof Blob) {
        const ext = scaled.type?.split("/")[1] ?? "dat";
        const base =
          original.name?.split(".").slice(0, -1).join(".") || "upload";
        return new File([scaled], `${base}.${ext}`, {
          type: scaled.type || original.type,
        });
      }
      return original;
    })
  );

  const { data: publication, error: publicationError } = await supabase
    .from("publications")
    .insert({
      author_id: authorId,
      type: "post",
    })
    .select("publication_id, created_at")
    .single();

  if (publicationError) throw publicationError;

  const publicationId = publication.publication_id;
  let uploads = [];

  try {
    uploads = await Promise.all(
      optimizedMedia.map((file, index) =>
        uploadMediaFile(publicationId, file, index)
      )
    );

    const mediaUrls = uploads.map((upload) => upload.publicUrl);

    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        post_id: publicationId,
        caption,
        pic_url: mediaUrls,
      })
      .select("post_id, caption, pic_url")
      .single();

    if (postError) throw postError;

    return {
      publication: {
        ...publication,
        post_id: post.post_id,
      },
      post,
    };
  } catch (err) {
    // best-effort cleanup
    await removeUploadedFiles(uploads);
    await supabase
      .from("publications")
      .delete()
      .eq("publication_id", publicationId);
    throw err;
  }
}

export async function createThread({ thread_text, authorId }) {
  if (!authorId) throw new Error("You must be signed in to create a thread.");
  if (!thread_text?.length) throw new Error("Thread must have content");

  const Pub_type = "thread";

  const { data: publication, error: pubError } = await supabase
    .from("publications")
    .insert({
      author_id: authorId,
      type: Pub_type,
    })
    .select("publication_id, created_at")
    .single();
  if (pubError) throw pubError;

  const publication_id = publication.publication_id;
  const created_at = publication.created_at;
  try {
    const { data: thread, error: threadError } = await supabase
      .from("threads")
      .insert({
        thread_id: publication_id,

        thread_text: thread_text,
      })
      .select("thread_id , thread_text")
      .single();

    if (threadError) throw threadError;

    return {
      publication: {
        ...publication,
        thread_id: thread.thread_id,
      },
      thread,
    };
  } catch (err) {
    await supabase
      .from("publications")
      .delete()
      .eq("publication_id", publication_id);
    throw err;
  }
}
//without endless-scroll
// export async function getPostsThreadsForUni(uniId) {
//   const { data, error } = await supabase.rpc("feed_get_page", {
//     p_limit: 10,
//     p_cursor: null,
//   });
//   if (error) {
//     throw error;
//   }

//   return data;
// }

export async function handleLike(actorId, publicationId) {
  if (!(actorId && publicationId))
    throw new Error("Acted publication or actor not received");

  const { error } = await supabase.from("publication_likes").insert({
    publication_id: publicationId,
    actor_id: actorId,
    reaction: "like",
  });

  if (error) throw error;
}

export async function handleUnLike(actorId, publicationId) {
  if (!(actorId && publicationId))
    throw new Error("Acted publication or actor not received");

  const { error } = await supabase
    .from("publication_likes")
    .delete("id")
    .eq("actor_id", actorId)
    .eq("publication_id", publicationId);
  if (error) throw error;
}

export async function createComment(publicationId, actorId, userComment) {
  if (!(actorId && publicationId && userComment))
    throw new Error("Missing data piece to insert a tuple relation");

  const { data, error } = await supabase
    .from("publication_comments")
    .insert({
      publication_id: publicationId,
      author_id: actorId,
      body: userComment,
    })
    .select(
      `body,
    author:profiles!publication_comments_author_id_fkey(
    id,
    avatar_url,
    display_name),
    author_id,
    comment_id,
    created_at,
    parent_comment_id,
    comment_likes`
    )
    .single();
  if (error) throw error;
  return data;
}

export async function fetchFeedPage({ cursor, limit = 10 }) {
  const { data, error } = await supabase.rpc("feed_get_page", {
    p_limit: limit,
    p_cursor: cursor ?? null,
  });
  if (error) throw error;
  return data; //includes next_cursor on each row
}

export async function receivePubData(user, postId) {
  if (!(user && postId))
    throw new Error("not authroized or post doesn't exist");

  const { data, error } = await supabase.rpc("get_publication_payload", {
    publication_uuid: postId,
    current_user_id: user,
    comments_limit: 50,
  });
  if (error) throw error;
  return data;
}

export async function createCommentLike(commentId, actorId) {
  if (!(commentId && actorId))
    throw new Error("Missing vital data information, cant create relationship");

  const { error } = await supabase.from("publication_comment_likes").insert({
    comment_id: commentId,
    actor_id: actorId,
  });

  if (error) throw error;
}

export async function deleteCommentLike(commentId, actorId) {
  if (!(commentId && actorId))
    return new Error("Missing an argument to perform action");

  const { data, error } = await supabase
    .from("publication_comment_likes")
    .delete("id")
    .eq("actor_id", actorId)
    .eq("comment_id", commentId);
}


