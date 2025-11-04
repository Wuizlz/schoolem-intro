import { Outlet } from "react-router-dom";
import SideLink from "./SideLink";
import UniversityQuery from "./UniversityQueryHandler";
import ProfileQuery from "./ProfileQueryHandler";
import supabase from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// ⬇️ NEW: import the modal and the modal content
import Modal from "./Modal";
import CreatePostModal from "./CreatePostModal";

function useSupabaseUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let canceled = false;

    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!canceled) {
        setUser(error ? null : data.user ?? null);
        setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      canceled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, userId: user?.id ?? null, loading };
}

export default function AppLayout() {
  // <Header />
  // <Sidebar/>
  // <Main>
  //   <Container>
  //   </Container>
  // </Main>

  const navigate = useNavigate();
  const { userId, loading } = useSupabaseUser();

  // Don’t run queries until inputs are ready
  const profileQ = ProfileQuery(userId, { enabled: !!userId });
  const uniId = profileQ.data?.uni_id;
  const uniQ = UniversityQuery(uniId, { enabled: !!uniId });

  const campusName =
    uniQ.data?.name ??
    profileQ.data?.display_name ??
    "University";

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
                  {campusName}
                </div>
              </div>
            </div>

            {/* Local nav */}
            <nav className="space-y-1">
              <SideLink to="/uni" label="Uni" icon="uni" />
              <SideLink to="/alerts" label="Alerts" icon="bell" />
              <SideLink to="/profile" label="Profile" icon="user" />

              {/* ⬇️ Create opens the modal (no navigation) */}
              <Modal>
                <Modal.Open opens="create-post">
                  {/* No `to` prop => SideLink renders as <button> */}
                  <SideLink label="Create" icon="plusCircle" />
                </Modal.Open>

                <Modal.Window name="create-post" widthClass="max-w-2xl">
                  <CreatePostModal />
                </Modal.Window>
              </Modal>

              <div className="pt-2 mt-2 border-t border-zinc-800" />
              <SideLink to="/more" label="More" icon="more" />
            </nav>
          </aside>

          {/* Page content swaps here */}
          <main className="flex-1 py-6 mx-auto max-w-[720px] w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
