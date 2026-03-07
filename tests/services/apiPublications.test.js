import { jest } from "@jest/globals";
import { createSupabaseMock } from "../mocks/supabaseMock.js";

const imageCompression = jest.fn(async (file) => file);

const supabaseMock = createSupabaseMock();

jest.unstable_mockModule("browser-image-compression", () => ({
  default: imageCompression,
}));

jest.unstable_mockModule("../../src/lib/supabase.js", () => ({
  default: supabaseMock,
}));

const { createPost, createThread } =
  await import("../../src/services/apiPublications.js");

describe("apiPublications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createPost throws when authorId is missing", async () => {
    await expect(
      createPost({ caption: "hi", mediaItems: [{}], authorId: null }),
    ).rejects.toThrow("You must be signed in");
  });

  test("createPost throws when mediaItems are missing", async () => {
    await expect(
      createPost({ caption: "hi", mediaItems: [], authorId: "user-1" }),
    ).rejects.toThrow("Select at least one photo or video before sharing.");
  });

  test("createThread throws when authorId is missing", async () => {
    await expect(
      createThread({ thread_text: "hello", authorId: null }),
    ).rejects.toThrow("You must be signed in");
  });

  test("createThread throws when thread_text is missing", async () => {
    await expect(
      createThread({ thread_text: "", authorId: "user-1" }),
    ).rejects.toThrow("Thread must have content");
  });

  test("createPost uploads media and creates post record", async () => {
    const publicationInsert = {
      insert: () => ({
        select: () => ({
          single: async () => ({
            data: { publication_id: "pub-1", created_at: "2026-01-01" },
            error: null,
          }),
        }),
      }),
    };

    const postInsert = {
      insert: () => ({
        select: () => ({
          single: async () => ({
            data: {
              post_id: "pub-1",
              caption: "cap",
              pic_url: ["https://cdn/p1.jpg"],
            },
            error: null,
          }),
        }),
      }),
    };

    supabaseMock.from
      .mockReturnValueOnce(publicationInsert)
      .mockReturnValueOnce(postInsert);

    supabaseMock.storage.from.mockReturnValue({
      upload: async () => ({ error: null }),
      getPublicUrl: () => ({
        data: { publicUrl: "https://cdn/p1.jpg" },
        error: null,
      }),
      remove: async () => ({ error: null }),
    });

    const result = await createPost({
      caption: "cap",
      mediaItems: [
        new File([new Uint8Array([1])], "photo.png", { type: "image/png" }),
      ],
      authorId: "user-1",
    });

    expect(result.post.post_id).toBe("pub-1");
    expect(result.publication.post_id).toBe("pub-1");
  });

  test("createPost cleans up uploads when post insert fails", async () => {
    jest.spyOn(Date, "now").mockReturnValue(123456);

    const publicationInsert = {
      insert: () => ({
        select: () => ({
          single: async () => ({
            data: { publication_id: "pub-2", created_at: "2026-01-01" },
            error: null,
          }),
        }),
      }),
    };

    const postInsert = {
      insert: () => ({
        select: () => ({
          single: async () => ({
            data: null,
            error: new Error("post insert failed"),
          }),
        }),
      }),
    };

    const cleanupChain = {
      delete: () => ({
        eq: async () => ({ error: null }),
      }),
    };

    supabaseMock.from
      .mockReturnValueOnce(publicationInsert)
      .mockReturnValueOnce(postInsert)
      .mockReturnValueOnce(cleanupChain);

    const storageApi = {
      upload: async () => ({ error: null }),
      getPublicUrl: () => ({
        data: { publicUrl: "https://cdn/p2.jpg" },
        error: null,
      }),
      remove: jest.fn(async () => ({ error: null })),
    };

    supabaseMock.storage.from.mockReturnValue(storageApi);

    await expect(
      createPost({
        caption: "cap",
        mediaItems: [
          new File([new Uint8Array([2])], "photo.png", { type: "image/png" }),
        ],
        authorId: "user-1",
      }),
    ).rejects.toThrow("post insert failed");

    expect(storageApi.remove).toHaveBeenCalledWith(["pub-2/123456-0.png"]);

    Date.now.mockRestore();
  });
});
