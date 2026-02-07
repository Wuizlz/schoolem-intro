import { Outlet } from "react-router-dom";
import SideBar from "../SideBar";
import { lazy, useState } from "react";
import Alerts from "../../pages/Alerts";
import MobileNav from "../MobileNav";

export default function AppLayout() {
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  return (
    <div
      className={`sm:grid sm:h-screen sm:grid-row-1 ${
        isAlertsOpen
          ? "sm:grid-cols-[4.5rem_auto_1fr]"
          : "sm:grid-cols-[4.5rem_1fr] lg:grid-cols-[18rem_1fr]"
      } bg-black`}
    >
      <div className="hidden sm:block ">
        <SideBar
          isAlertsOpen={isAlertsOpen}
          setIsAlertsOpen={setIsAlertsOpen}
        />
      </div>

      {isAlertsOpen && (
        <div className="hidden sm:block border-r border-gray-800 overflow-y-auto">
          <Alerts />
        </div>
      )}

      <main className="h-full overflow-y-auto pb-20 sm:pb-0">
        <Outlet />
      </main>

      <MobileNav />
    </div>
  );
}
