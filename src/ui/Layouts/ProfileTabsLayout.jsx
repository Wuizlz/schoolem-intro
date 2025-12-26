import { Outlet, useOutletContext } from "react-router-dom";
import ProfileTabsNav from "../profile/ProfileTabsNav";

export default function ProfileTabsLayout() {
  

  return (
    <div className="flex flex-col w-full ">
      <div className="flex justify-around">
        <ProfileTabsNav />
      </div>
      <main className=" flex flex-1 overflow-y-scroll border-t border-gray-500 rounded-lg">
        <Outlet/>
      </main>
    </div>
  );
}
