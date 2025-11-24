import { Outlet } from "react-router-dom";
import ProfileTabsNav from "../profile/ProfileTabsNav";

export default function ProfileTabsLayout() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex w-10/12">
        <ProfileTabsNav />
      </div>
      <main className="flex-1 overflow-y-scroll border-t border-gray-500 w-10/12 rounded-lg">
        <Outlet />
      </main>
    </div>
  );
}
