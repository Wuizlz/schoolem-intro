# Tests Guide

## Supabase Mock

**File:** `tests/mocks/supabaseMock.js`

**Purpose**

- Provides a fake Supabase client for unit tests.
- Prevents tests from hitting the network or any real database.
- Lets tests control responses and assert calls.

**How it works**

- Each Supabase method is a `jest.fn()` mock.
- Tests can set return values with `mockResolvedValue(...)`.
- Tests can verify usage with `toHaveBeenCalledWith(...)`.

**How it’s handled in tests**

- The real import `src/lib/supabase.js` is replaced via `jest.unstable_mockModule(...)`.
- Services under test receive this fake client automatically.

**Example usage**

```js
supabaseMock.auth.signUp.mockResolvedValue({
  data: { user: {}, session: {} },
  error: null,
});

await signUpWithEmail(...);

expect(supabaseMock.auth.signUp).toHaveBeenCalled();
```

**Notes**

- This is a test double only: no SQL, no network, no Supabase logic.
- Add new mock methods here if a service starts calling new Supabase APIs.

---

## ESM Module Mocking (jest.unstable_mockModule)

**Example (from `tests/services/apiActions.test.js`)**

```js
const supabaseMock = createSupabaseMock();

jest.unstable_mockModule("../../src/lib/supabase.js", () => ({
  default: supabaseMock,
}));

const { createFollower, removeFollow, amIfollowing, deleteFollowerApi } =
  await import("../../src/services/apiActions.js");
```

**Purpose**

- Ensures the service module uses the fake Supabase client instead of the real one.
- Keeps tests isolated from the network and from real Supabase credentials.

**What `unstable_mockModule` means**

- Jest’s ESM (ES Modules) mocking API.
- Because this repo is `"type": "module"`, we must mock **before** the module is imported.
- The "unstable" label indicates Jest’s ESM mocking API is still evolving.

**Important note**

- The "unstable" label refers to Jest’s ESM mocking API maturity, not to our tests.
- This is the current official way to mock ESM modules in Jest.

**Why we mock `../../src/lib/supabase.js`**

- The service under test imports `supabase` from `src/lib/supabase.js`.
- We intercept that import and replace it with our fake client.

**Why the callback returns `{ default: supabaseMock }`**

- `src/lib/supabase.js` uses a **default export**.
- Jest expects the replacement to match the module’s export shape.

**What actually happens**

- When `apiActions.js` is imported, its internal `import supabase from "../lib/supabase"` resolves to **our mock**.
- All Supabase calls inside the service now use the mock.

---

## apiActions Tests (Failure + Return Paths)

**File:** `tests/services/apiActions.test.js`

**What these tests protect**

- Input validation: required IDs must be present.
- Expected return behavior in `amIfollowing` for:
  - "not found" (PGRST116) → returns `false`
  - "found" → returns `true`

**Why `beforeEach(() => jest.clearAllMocks())`**

- Resets all mock call history and custom return values before each test.
- Prevents one test’s mock data from leaking into another.

**Why `rejects.toThrow(...)`**

- These functions return Promises.
- `rejects.toThrow("...")` asserts the Promise rejects with an error
  containing the given message.

**About the “callback chain”**

- It’s not real callbacks; it’s **method chaining**.
- The service code calls:
  - `supabase.from("followings").select("id").eq(...).eq(...).maybeSingle()`
- In the test, we return nested objects that expose the next method
  in the chain. This simulates Supabase’s fluent API.

**Example chain (simplified explanation)**

```js
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
```

**Step‑by‑step what that means**

1. `supabase.from("followings")` returns an object that has a `select()` method.
2. Calling `.select("id")` returns an object that has an `eq()` method.
3. Calling the first `.eq("follower_id", followerId)` returns an object
   that has a second `eq()` method.
4. Calling the second `.eq("followee_id", followeeId)` returns an object
   that has `maybeSingle()`.
5. `maybeSingle()` resolves to `{ data, error }`, which is what the real
   Supabase client would return.

**Why it looks like `select: () => ({ eq: () => ({ ... }) })`**

- Each arrow function returns the next link in the chain.
- This mirrors the real fluent API so the service code can run unchanged.

**Important note**

- The services are written against Supabase’s fluent API.
- If we don’t mimic the chain (`from().select().eq()...`), the test crashes with
  `TypeError: ... is not a function` before we can assert behavior.

---

## apiProfile (In‑Depth)

**File:** `src/services/apiProfile.js`

**Purpose**

- Owns signup flows, profile creation/updates, and profile‑related queries.
- Wraps Supabase Auth + database access with application‑specific rules.

### `signUpWithEmail(...)`

**Inputs**

- `{ email, password, username, firstName, lastName, birthdate, gender, genderLabel }`

**Flow**

1. Calls RPC `email_domain` to resolve the user’s university by email domain.
2. If no university, throws `"University not yet supported."`.
3. Calls `supabase.auth.signUp` with:
   - `email`, `password`
   - `emailRedirectTo` derived from `window.location.origin`
   - `user_metadata` fields like `display_name`, `full_name`, `birthdate`, etc.
4. If Supabase returns "user already registered", throws a friendly message.
5. If a `session` exists (email confirmation OFF), inserts a profile row.
6. Returns `{ user, hasSession, emailConfirmation, profileInserted, profileError, username }`.

**Why it matters**

- Guarantees domain gating before account creation.
- Handles the “already registered” case cleanly for UX.

### `ensureProfile(opts)`

**Inputs**

- `opts.enforceDomain` (boolean)

**Flow**

1. Fetches current session. If no session, throws `"Not signed in"`.
2. Builds `display_name` from user metadata.
3. Calls RPC `university_id_for_email` to map the user email → uni.
4. If `enforceDomain` and no uni, returns `{ allowed: false, created: false }`.
5. Fetches existing profile row.
6. Builds the row to upsert: `{ id, email, display_name, uni_id? }`.
7. Upserts only if missing or out of date.
8. Returns `{ created, user, allowed: true, uniId }`.

**Why it matters**

- Ensures every signed‑in user has a profile row.
- Avoids unnecessary writes if data already matches.

### `startAuthListenerEnsureProfile()`

**Purpose**

- Registers an auth state listener.
- On `SIGNED_IN`, runs `ensureProfile()` once per user.
- Returns a cleanup function that unsubscribes.

### `updateProfile(...)`

**Inputs**

- `{ fullName, username, bio, birthdate, gender, avatarFile }`

**Flow**

1. Reads current user (must be authenticated).
2. If `avatarFile` exists:
   - Uploads to `profile-pic` bucket.
   - Uses `getPublicUrl`, appends cache‑busting query param.
3. Converts birthdate from `MM/DD/YYYY` to `YYYY-MM-DD` if needed.
4. Updates `profiles` row for the user.
5. Returns `{ success: true, avatarUrl }`.

### `getUserPublications(username, pubType)`

**Flow**

1. Looks up `profiles.id` by `display_name`.
2. Queries `publications` with joins:
   - `post:posts(caption,pic_url)`
   - `thread:threads(thread_text)`
3. Filters by `pubType` if provided.
4. Orders newest first.

### `getProfileByUsername(username)`

**Flow**

1. Fetches profile basics by `display_name`.
2. Counts publications, followings, followers.
3. Returns a profile object with counts.

### `getUserFollowings(username, sessionUser)`

### `getUserFollowers(username, sessionUser)`

**Flow**

- Call RPCs `get_followings_by_username` / `get_followers_by_username`.
- Provide `sessionUser` for context.

---

## Testing Notes for apiProfile

**Supabase calls used**

- `auth.signUp`, `auth.getSession`, `auth.onAuthStateChange`, `auth.getUser`
- `rpc("email_domain")`, `rpc("university_id_for_email")`
- `from("profiles").select/insert/upsert/update`
- `from("publications").select/order`
- `from("followings").select` (for counts)
- `storage.from("profile-pic").upload/getPublicUrl`

**Why mocks are required**

- This module touches both Auth and Database.
- It depends on `window.location.origin` in `signUpWithEmail`.
- Tests should stub these to keep them fast and deterministic.

**Key expectations in unit tests**

- Domain gating returns the right error when no university.
- “Already registered” message is mapped correctly.
- `ensureProfile` handles: no session, domain enforcement, upsert logic.

**Mocking note (async calls)**

- `mockResolvedValue(...)` makes a mocked async call return the given `{ data, error }`.
- Example: `supabaseMock.rpc.mockResolvedValue({ data: null, error: null })`
  simulates “RPC succeeded but returned no university,” which triggers
  `"University not yet supported."` in `signUpWithEmail`.
- The RPC logic does **not** run; the mock intercepts it and returns
  whatever we configured.

**Why the “already registered” test returns `data: 123` from RPC**

- `data: 123` stands for a valid university ID (any non‑null value works).
- This bypasses the domain gating so the code reaches `auth.signUp`.
- `auth.signUp` then returns `{ data: null, session: null, error: "User already registered" }`.
- That’s not contradictory: the function throws on the error and never uses
  the returned `user`/`session` values.

**`ensureProfile` test: `enforceDomain`**

- `enforceDomain: true` means: after login, if the user’s email domain
  doesn’t map to a university, do **not** create/update a profile.
- The test mocks `university_id_for_email` to return `null`.
- Expected result: `{ allowed: false, created: false }`.
- This verifies the guard‑rail path (it should stop instead of upserting).

**Why both `signUpWithEmail` and `ensureProfile` check domains**

- `signUpWithEmail` gates **account creation** (pre‑signup).
- `ensureProfile` is a **post‑login safety net**:
  - Handles users created before domain enforcement existed.
  - Handles missing profile rows after email confirmation.
  - Handles cases where user data changes or is incomplete.

**Test: “ensureProfile upserts when missing”**

- Mocks a valid session user (id + email + display_name).
- RPC returns `data: 55` to simulate a valid university ID.
- First `from(...)` chain returns no existing profile (`data: null`).
- Second `from(...)` call provides an `upsert` method that succeeds.
- Expected result:
  - `created: true` (profile row did not exist)
  - `allowed: true` (domain is valid)
  - `uniId: 55` (mapped from the RPC)

---

## apiPublications (createPost tests)

**File:** `tests/services/apiPublications.test.js`

### Guard‑rail tests (input validation)

**What these tests cover**

- `createPost` throws when:
  - `authorId` is missing
  - `mediaItems` is empty
- `createThread` throws when:
  - `authorId` is missing
  - `thread_text` is empty

**Why they matter**

- Prevents invalid writes to the database and storage.
- Ensures user‑friendly error messages surface early.

### Test: “createPost uploads media and creates post record”

**What this test verifies**

- A successful post creation flow:
  1. Insert into `publications`
  2. Upload media to storage
  3. Insert into `posts`
- Returns combined `publication` + `post` data.

**Mocked chain setup**

```js
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
```

- This simulates:  
  `supabase.from("publications").insert(...).select(...).single()`
- It returns a fake publication row.

```js
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
```

- This simulates:  
  `supabase.from("posts").insert(...).select(...).single()`
- It returns a fake post row.

**Why `mockReturnValueOnce` is used**

```js
supabaseMock.from
  .mockReturnValueOnce(publicationInsert)
  .mockReturnValueOnce(postInsert);
```

- `createPost` calls `supabase.from(...)` **twice**:
  1. for `publications`
  2. for `posts`
- `mockReturnValueOnce` lets each call return a different chain.

**Storage mock**

```js
supabaseMock.storage.from.mockReturnValue({
  upload: async () => ({ error: null }),
  getPublicUrl: () => ({
    data: { publicUrl: "https://cdn/p1.jpg" },
    error: null,
  }),
  remove: async () => ({ error: null }),
});
```

- Simulates the storage bucket:
  - `upload` succeeds
  - `getPublicUrl` returns the expected URL
  - `remove` exists but isn’t used in the success path

**Assertions**

- Both `result.post.post_id` and `result.publication.post_id` match `"pub-1"`.
- Confirms the combined payload is returned correctly.

---

### Test: “createPost cleans up uploads when post insert fails”

**What this test verifies**

- If the second insert (`posts`) fails:
  - Uploaded files are deleted
  - The publication row is removed
  - The error is thrown to the caller

**Why we stub time**

```js
jest.spyOn(Date, "now").mockReturnValue(123456);
```

- The upload path uses `Date.now()` to build the file name.
- We fix it to make the expected path deterministic in the test.

**Mocked chains**

- `publicationInsert`: success for `publications`
- `postInsert`: failure for `posts` (returns an error)
- `cleanupChain`: simulates `supabase.from("publications").delete().eq(...)`

```js
supabaseMock.from
  .mockReturnValueOnce(publicationInsert)
  .mockReturnValueOnce(postInsert)
  .mockReturnValueOnce(cleanupChain);
```

- `createPost` calls `supabase.from(...)` **three times** in this path:
  1. insert into `publications`
  2. insert into `posts` (fails)
  3. cleanup delete from `publications`

**Storage mock with `remove` spy**

```js
const storageApi = {
  upload: async () => ({ error: null }),
  getPublicUrl: () => ({
    data: { publicUrl: "https://cdn/p2.jpg" },
    error: null,
  }),
  remove: jest.fn(async () => ({ error: null })),
};
```

- We spy on `remove` to confirm cleanup happens.

**Key expectation**

```js
expect(storageApi.remove).toHaveBeenCalledWith(["pub-2/123456-0.png"]);
```

- Confirms the cleanup path deletes the uploaded file.

**Summary**

- These tests are _mostly_ failure/guard‑rail checks.
- There are also two **success path** checks:
  - `amIfollowing` returns `false` on “not found”
  - `amIfollowing` returns `true` on “found”

---

## setupGlobals (Test Environment)

**File:** `tests/setupGlobals.js`

**Purpose**

- Adds minimal browser‑like globals for Node test runs.
- Prevents `ReferenceError` when code uses `window`, `Blob`, or `File`.

**What it does**

- Defines `globalThis.window` with a basic `location.origin`.
- Defines `globalThis.Blob` and `globalThis.File` if they don’t exist.
- Keeps tests lightweight (not a full DOM or JSDOM environment).

**Why it matters**

- Some services use `window.location.origin`.
- File and Blob are required for upload logic in `createPost`.

**Example**

- If the app runs at `http://localhost:3000`, then:
  - `window.location.origin` is `http://localhost:3000`
  - `emailRedirectTo` becomes `http://localhost:3000/auth/callback`
