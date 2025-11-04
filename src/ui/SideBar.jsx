import Modal from "./Modal";
import CreatePostModal from "./CreatePostModal";
import SideLink from "./SideLink";

/**
 * SideBar
 * - Shows brand + university name
 * - Local nav links
 * - "Create" opens the CreatePostModal using Modal.Open/Modal.Window
 * - Sign-out button via prop
 *
 * icon names assume your RenderIcon maps: "home", "bell", "user", "plus", "menu"
 */
export default function SideBar({ uniName = "University", onSignOut }) {
  return (
    <aside className="hidden md:block w-60 py-6 sticky top-0 self-start min-h-dvh">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-8">
        <img
          src="/favicon.ico"
          alt="SchoolEm"
          className="h-9 w-9 rounded-2xl border border-zinc-800"
        />
        <div className="leading-tight">
          <div className="font-semibold">SchoolEm</div>
          <div className="text-xs text-zinc-400 truncate max-w-36">
            {uniName}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="space-y-1">
        <SideLink to="/uni" label="Uni" icon="home" />
        <SideLink to="/alerts" label="Alerts" icon="bell" />
        <SideLink to="/profile" label="Profile" icon="user" />

        {/* Create -> Modal */}
        <Modal>
          <Modal.Open opens="create-post">
            {/* No `to` prop => renders a <button> (no navigation) */}
            <SideLink label="Create" icon="plus" />
          </Modal.Open>
          <Modal.Window name="create-post" widthClass="max-w-2xl">
            <CreatePostModal />
          </Modal.Window>
        </Modal>

        <div className="pt-2 mt-2 border-t border-zinc-800" />
        <SideLink to="/more" label="More" icon="menu" />
      </nav>

      {/* Sign out */}
      {onSignOut && (
        <div className="mt-8">
          <button
            onClick={onSignOut}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 px-3 py-2 text-sm"
          >
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}
