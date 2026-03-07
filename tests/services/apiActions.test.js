import { jest } from "@jest/globals";
import { createSupabaseMock } from "../mocks/supabaseMock.js";

const supabaseMock = createSupabaseMock();

jest.unstable_mockModule("../../src/lib/supabase.js", () => ({
  default: supabaseMock,
}));

const { createFollower, removeFollow, amIfollowing, deleteFollowerApi } =
  await import("../../src/services/apiActions.js");

describe("apiActions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createFollower throws when ids missing", async () => {
    await expect(createFollower(null, "user")).rejects.toThrow(
      "Need both follower and followee to perform action",
    );
  });

  test("removeFollow throws when ids missing", async () => {
    await expect(removeFollow(null, "user")).rejects.toThrow(
      "Need both follower and followee to perform action",
    );
  });

  test("amIfollowing throws when ids missing", async () => {
    await expect(amIfollowing(null, "user")).rejects.toThrow(
      "No users to act on",
    );
  });

  test("amIfollowing returns false for PGRST116", async () => {
    supabaseMock.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: async () => ({
              data: null,
              error: { code: "PGRST116" },
            }),
          }),
        }),
      }),
    });

    await expect(amIfollowing("a", "b")).resolves.toBe(false);
  });

  test("amIfollowing returns true when record exists", async () => {
    supabaseMock.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: async () => ({
              data: { id: 1 },
              error: null,
            }),
          }),
        }),
      }),
    });

    await expect(amIfollowing("a", "b")).resolves.toBe(true);
  });

  test("deleteFollowerApi throws when ids missing", async () => {
    await expect(deleteFollowerApi(null, "user")).rejects.toThrow(
      "Need necessary data to perform action ",
    );
  });
});
