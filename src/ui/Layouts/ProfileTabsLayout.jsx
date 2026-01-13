import { Outlet, useOutletContext } from "react-router-dom";
import ProfileTabsNav from "../profile/ProfileTabsNav";

export default function ProfileTabsLayout() {
  return (
    <div className="flex flex-col min-[1400px]:w-5xl">
      <div className="flex justify-around">
        <ProfileTabsNav />
      </div>
      <main className=" flex flex-1 overflow-y-scroll border-t  w-full border-gray-500 rounded-lg">
        <Outlet />
      </main>
    </div>
  );
}
