import { jest } from "@jest/globals";
import { createSupabaseMock } from "../mocks/supabaseMock.js";

const supabaseMock = createSupabaseMock();

jest.unstable_mockModule("../../src/lib/supabase.js", () => ({
  default: supabaseMock,
}));

const { signUpWithEmail, ensureProfile } =
  await import("../../src/services/apiProfile.js");

describe("apiProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("signUpWithEmail throws when university not supported", async () => {
    supabaseMock.rpc.mockResolvedValue({ data: null, error: null });

    await expect(
      signUpWithEmail({
        email: "person@example.com",
        password: "Password1!",
        username: "user",
        firstName: "Test",
        lastName: "User",
      }),
    ).rejects.toThrow("University not yet supported.");
  });

  test("signUpWithEmail maps already-registered error", async () => {
    supabaseMock.rpc.mockResolvedValue({ data: 123, error: null });
    supabaseMock.auth.signUp.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "User already registered" },
    });

    await expect(
      signUpWithEmail({
        email: "person@example.com",
        password: "Password1!",
        username: "user",
      }),
    ).rejects.toThrow("Account already created, sign in instead!");
  });

  test("ensureProfile returns not allowed when enforceDomain and no uni", async () => {
    supabaseMock.auth.getSession.mockResolvedValue({
      data: {
        session: { user: { id: "u1", email: "a@b.com", user_metadata: {} } },
      },
      error: null,
    });

    supabaseMock.rpc.mockResolvedValue({ data: null, error: null });

    const result = await ensureProfile({ enforceDomain: true });

    expect(result.allowed).toBe(false);
    expect(result.created).toBe(false);
  });

  test("ensureProfile upserts when missing", async () => {
    supabaseMock.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: {
            id: "u1",
            email: "a@b.com",
            user_metadata: { display_name: "Test User" },
          },
        },
      },
      error: null,
    });

    supabaseMock.rpc.mockResolvedValue({ data: 55, error: null });

    supabaseMock.from
      .mockReturnValueOnce({
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: null, error: null }),
          }),
        }),
      })
      .mockReturnValueOnce({
        upsert: jest.fn().mockResolvedValue({ error: null }),
      });

    const result = await ensureProfile();

    expect(result.created).toBe(true);
    expect(result.allowed).toBe(true);
    expect(result.uniId).toBe(55);
  });
});
