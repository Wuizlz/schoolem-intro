import { Outlet } from "react-router-dom";
import SideBar from "../SideBar";
import { useState } from "react";
import Alerts from "../../pages/Alerts";

export default function AppLayout() {
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  return (
    <div className={`grid h-screen grid-cols-1 ${isAlertsOpen ? 'sm:grid-cols-[4.5rem_auto_1fr]' : 'sm:grid-cols-[4.5rem_1fr] lg:grid-cols-[18rem_1fr]'} bg-black`}>
      <div className="hidden sm:block overflow-hidden">
        <SideBar isAlertsOpen={isAlertsOpen} setIsAlertsOpen={setIsAlertsOpen} />
      </div>

      {isAlertsOpen && (
        <div className="hidden sm:block border-r border-gray-800">
            <Alerts />
        </div>
      )}

      <main className="h-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
