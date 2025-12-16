import { Outlet } from "react-router-dom";
import { useState } from "react";
import SideBar from "../SideBar";
import Alerts from "../../pages/Alerts";

export default function AppLayout() {
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  return (
    <div
      className={`sm:grid sm:h-screen sm:grid-row-1 ${
        isAlertsOpen
          ? "sm:grid-cols-[4.5rem_auto_1fr]"
          : "sm:grid-cols-[4.5rem_1fr] lg:grid-cols-[18rem_1fr]"
      } bg-[var(--color-grey-50)] text-[var(--color-grey-900)]`}
    >
      <div className="hidden sm:block">
        <SideBar isAlertsOpen={isAlertsOpen} setIsAlertsOpen={setIsAlertsOpen} />
      </div>

      {isAlertsOpen && (
        <div className="hidden sm:block border-r border-[var(--color-grey-200)] overflow-y-auto bg-[var(--color-grey-50)]">
          <Alerts />
        </div>
      )}

      <main className="h-full overflow-y-auto bg-[var(--color-grey-50)]">
        <Outlet />
      </main>
    </div>
  );
}