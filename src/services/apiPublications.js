import supabase from "./supabase";

const POSTS_BUCKET = "post-media";
const POST_TYPE = "post";

function ensureFile(candidate) {
  if (!candidate) throw new Error("Invalid media item.");
  if (candidate instanceof File) return candidate;
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
      mediaItems.map((item, index) =>
        uploadMediaFile(publicationId, item, index)
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
  console.log(thread_text, authorId);
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

export async function getPostsThreadsForUni(uniId) {
  if (!uniId) return new Error("Missing University id ");

  const { data, error } = await supabase
    .from("publications")
    .select(
      `
      publication_id,
      created_at,
      author_id,
      type,
      posts(
        caption,
        pic_url
      ),
      threads(
        thread_text
      ),
      profiles!inner(
        id,
        avatar_url,
        uni_id,
        display_name,
        full_name
      )
    `
    )
    .eq("profiles.uni_id", uniId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Unable to load post for this University");
  }

  return data;
}

export async function getPublicationCountByAuth(author_id, type)
{
  if(!author_id) throw new Error("Need access to fetch own count")

  const query = supabase.from("publications").select("publication_id", {count: 'exact', head: true}).eq("author_id", author_id)

  if(type) query.eq("type", type )

    const {count, error } = await query;
    if (error) throw error 
    return count ?? 0;
}
