import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import supabase from "../services/supabase";

import Modal from "../ui/Modal";
import CreatePostModal from "../ui/createPostModal";

/**
 * Uni.jsx (annotated)
 * -------------------------------------------------------------
 * What this page does
 * - Protects the route: if you're not signed in, go to /signin
 * - Reads your profile row (from public.profiles)
 * - If profile has uni_id, reads that university (from public.universities)
 * - Shows a left sidebar and a main column (greeting + Quickies + Feed)
 * - Quickies & Feed are mocked for now; comments below show how to connect DB
 *
 * Where to connect to the database later
 * - Replace mockQuickies() with a real query (e.g., recent active users or "stories")
 * - Replace mockFeed() with a posts query (join profiles for author names)
 * - See the commented examples near the bottom of this file
 *
 * Tables expected (with RLS)
 * - public.profiles: id(uuid, =auth.users.id), email, display_name, uni_id(uuid)
 *   RLS: auth users can select/insert/update ONLY their own row
 * - public.universities: id uuid, name text, domains text[]
 *   RLS: auth users can select
 *
 * Auth notes
 * - ensureProfile() (called elsewhere during sign-in) should create your profile row
 * - Here we only read; we don't mutate
 */
export default function Uni() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // The signed-in Supabase user (from Auth)
  const [checking, setChecking] = useState(true); // True until we know if there is a session

  // ------------------------- Auth guard -------------------------------------
  // Check if there is a session. If no session, go to /signin.
  // Also subscribe to auth changes so if the user signs out in another tab,
  // this page will react and redirect.
  useEffect(() => {
    let unsub;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const authed = data?.session?.user ?? null;
      if (!authed) {
        navigate("/signin", { replace: true });
        return;
      }
      setUser(authed);
      setChecking(false);

      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        if (!session?.user) navigate("/signin", { replace: true });
      });
      // keep unsubscribe so we don't leak listeners
      unsub = sub.subscription?.unsubscribe;
    })();

    return () => {
      try {
        unsub?.();
      } catch {}
    };
  }, [navigate]);

  // ------------------------- Profile query ----------------------------------
  // Reads your own profile row. This relies on RLS allowing the current user
  // to select their own row only. We fetch display_name and uni_id for UI.
  const profileQ = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user, // don't run until we know user exists
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, display_name, uni_id")
        .eq("id", user.id)
        .single();
      if (error) throw error; // react-query will track & show if needed
      return data;
    },
  });

  // ------------------------- University query -------------------------------
  // If profile has a uni_id, we look up the university for its name/domains.
  const uniQ = useQuery({
    queryKey: ["university", profileQ.data?.uni_id],
    enabled: Boolean(profileQ.data?.uni_id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("universities")
        .select("id, name, domains")
        .eq("id", profileQ.data?.uni_id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // ------------------------- Derived display name ---------------------------
  // We prefer display_name stored in the profile, then fall back to metadata
  // on the auth user, and finally the email if nothing else exists.
  const displayName = useMemo(() => {
    const meta = user?.user_metadata || {};
    const fromProfile = profileQ.data?.display_name?.trim();
    const fromMeta =
      meta.display_name?.trim() ||
      [meta.first_name, meta.last_name].filter(Boolean).join(" ").trim();
    return fromProfile || fromMeta || user?.email || "";
  }, [user, profileQ.data?.display_name]);

  // Sign out button handler
  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/signin", { replace: true });
  }

  // While we check if a session exists, show a very simple screen
  if (checking) {
    return (
      <main className="min-h-dvh grid place-items-center bg-black text-zinc-300">
        Checking session…
      </main>
    );
  }

  // If profile is loading OR (we have a uni_id and the university query is loading)
  const isLoading =
    profileQ.isLoading || (Boolean(profileQ.data?.uni_id) && uniQ.isLoading);

  // ------------------------- TEMP DATA --------------------------------------
  // Quickies & Feed are hard-coded for now. Replace with real queries later.
  const Quickies = mockQuickies(displayName);
  const feed = mockFeed(displayName);

  // Example: how to load posts from DB (when ready)
  // 1) Create a table `public.posts` with columns like:
  //    id uuid pk, author_id uuid ref profiles.id, caption text, image_url text, created_at timestamptz default now()
  // 2) RLS idea:
  //    - SELECT: true for authenticated
  //    - INSERT: only author_id = auth.uid()
  // 3) Then use react-query like this:
  // const postsQ = useQuery({
  //   queryKey: ["posts"],
  //   queryFn: async () => {
  //     const { data, error } = await supabase
  //       .from("posts")
  //       .select("id, caption, image_url, created_at, author:profiles(id, display_name)")
  //       .order("created_at", { ascending: false })
  //       .limit(20);
  //     if (error) throw error;
  //     return data;
  //   },
  // });
  // And map it to this component's shape:
  // const feed = postsQ.data?.map((row) => ({
  //   id: row.id,
  //   author: {
  //     name: row.author?.display_name || "Unknown",
  //     initials: (row.author?.display_name || "U").split(" ").map(s=>s[0]).join("").toUpperCase(),
  //   },
  //   timeAgo: new Date(row.created_at).toLocaleTimeString(),
  //   image: row.image_url,
  //   caption: row.caption,
  //   comments: 0, // replace with count from a comments table
  //   meta: "",   // any small meta text
  // })) ?? [];

  return (
    <div className="min-h-dvh bg-black text-zinc-100">
      <div className="mx-auto max-w-[1200px] px-3 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* ----------------------- Sidebar ----------------------- */}
          <aside className="hidden md:block w-60 py-6 sticky top-0 self-start min-h-dvh">
            {/* Brand + campus name */}
            <div className="flex items-center gap-3 mb-8">
              <img
                src="/favicon.ico"
                alt="SchoolEm"
                className="h-9 w-9 rounded-2xl border border-zinc-800"
              />
              <div className="leading-tight">
                <div className="font-semibold">SchoolEm</div>
                <div className="text-xs text-zinc-400 truncate max-w-36">
                  {uniQ.data?.name || "University"}
                </div>
              </div>
            </div>

            {/* Local nav; hook these to routes when ready */}
            <nav className="space-y-1">
              <NavItem label="Uni" active icon={<IconHome />} />
              <NavItem label="Alerts" icon={<IconBell />} onClick={() => {}} />
              <NavItem
                label="Create"
                icon={<IconPlusCircle />}
                onClick={() => {}}
              />
              <NavItem label="Profile" icon={<IconUser />} onClick={() => {}} />
              {/* NEW: Create nav item opens modal*/}
              <Modal>
                <Modal.Open opens="create-post">
                  <NavItem label="Create" icon={<IconPlusCircle />} />
                </Modal.Open>
                <Modal.Window name="create-post" widthClass="max-w-2xl">
                  <CreatePostModal />
                </Modal.Window>
              </Modal>
              <div className="pt-2 mt-2 border-t border-zinc-800" />
              <NavItem label="More" icon={<IconMenu />} onClick={() => {}} />
            </nav>

            {/* Sign out */}
            <div className="mt-8">
              <button
                onClick={handleSignOut}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 px-3 py-2 text-sm"
              >
                Sign out
              </button>
            </div>
          </aside>

          {/* ----------------------- Main column ------------------- */}
          <main className="flex-1 py-6 mx-auto max-w-[720px] w-full">
            {/* Greeting / header shows name + campus */}
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold">
                Welcome{displayName ? `, ${displayName}` : ""}
              </h1>
              <p className="text-sm text-zinc-400">
                {isLoading
                  ? "Loading your campus…"
                  : uniQ.data?.name || "Your campus"}
              </p>
            </div>

            {/* Quickies: stories-style avatars; replace mock with DB if you want */}
            <section className="mb-6">
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
                {Quickies.map((s) => (
                  <Story
                    key={s.id}
                    name={s.name}
                    avatarSeed={s.avatarSeed}
                    active={s.active}
                  />
                ))}
              </div>
            </section>

            {/* Feed: list of posts; replace mock with postsQ.data mapping */}
            <section className="space-y-5">
              {feed.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

// --------------------------- UI pieces -------------------------------------
function NavItem({ label, icon, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-sm",
        active
          ? "bg-zinc-900 border border-zinc-800"
          : "hover:bg-zinc-900/60 border border-transparent",
      ].join(" ")}
    >
      <span className="h-8 w-8 grid place-items-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
        {icon}
      </span>
      <span className="text-left flex-1">{label}</span>
    </button>
  );
}

function Story({ name, avatarSeed, active }) {
  return (
    <div className="flex flex-col items-center w-16 shrink-0">
      {/* Gradient ring wrapper */}
      <div className="p-0.5 rounded-full bg-linear-to-tr from-amber-500 to-yellow-300">
        {/* Inner circle with initial (avatarSeed) */}
        <div
          className={
            "h-14 w-14 rounded-full grid place-items-center text-sm font-semibold " +
            (active ? "ring-2 ring-yellow-300" : "") +
            " bg-zinc-900"
          }
        >
          {avatarSeed}
        </div>
      </div>
      <div className="mt-1.5 text-[11px] text-zinc-400 truncate w-full text-center">
        {name}
      </div>
    </div>
  );
}

function PostCard({ post }) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-950">
      {/* Header with author badge + timestamp + more menu */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-zinc-900 grid place-items-center text-xs border border-zinc-800">
            {post.author.initials}
          </div>
          <div>
            <div className="text-sm font-medium">{post.author.name}</div>
            <div className="text-[11px] text-zinc-400">{post.timeAgo}</div>
          </div>
        </div>
        <button className="h-8 w-8 grid place-items-center rounded-md hover:bg-zinc-900">
          <IconMore />
        </button>
      </div>

      {/* Media: show image if provided; otherwise a placeholder box */}
      <div className="px-3">
        <div className="overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800">
          {post.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.image}
              alt="post"
              className="w-full h-auto object-cover"
            />
          ) : (
            <div className="aspect-4/5 w-full bg-zinc-900" />
          )}
        </div>
      </div>

      {/* Actions: icons + tiny meta text */}
      <div className="px-2">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-3 text-zinc-300">
            <IconHeart />
            <IconMessage />
            <IconSend />
          </div>
          <div className="text-[11px] text-zinc-400">{post.meta}</div>
        </div>
      </div>

      {/* Caption + comment input */}
      <div className="px-4 pb-3">
        <div className="text-sm">
          <span className="font-medium mr-1">{post.author.name}</span>
          {post.caption}
        </div>
        <button className="mt-1 text-xs text-zinc-400 hover:text-zinc-300">
          View all {post.comments} comments
        </button>
        <div className="mt-2">
          <input
            className="w-full bg-transparent border-t border-zinc-900 focus:outline-none text-sm placeholder-zinc-500 pt-2"
            placeholder="Say something…"
          />
        </div>
      </div>
    </article>
  );
}

// -------------------------- Icons (no deps) --------------------------------
function IconHome() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconPlusCircle() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}
function IconMenu() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
function IconMore() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </svg>
  );
}
function IconHeart() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}
function IconMessage() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  );
}
function IconSend() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

// -------------------------- Mock data --------------------------------------
// These help you see the UI without needing real DB data yet.
// Replace them with real queries when you build posts/stories tables.
function mockQuickies(displayName) {
  const names = [displayName || "You", "Roland", "Wuzzi", "Dimitri"];
  return names.map((n, i) => ({
    id: i + 1,
    name: n,
    avatarSeed: (n[0] || "?").toUpperCase(),
    active: i === 0,
  }));
}

function mockFeed(displayName) {
  return [
    {
      id: "p1",
      author: {
        name: displayName || "Wuzi",
        initials: (
          displayName
            ?.split(" ")
            .map((s) => s[0])
            .join("") || "WZ"
        ).toUpperCase(),
      },
      timeAgo: "25m",
      image: "", // set a URL to test images
      caption: "Me and the crew!",
      comments: 4,
      meta: "7 clubs",
    },
  ];
}
