import { Outlet } from "react-router-dom";
import SideBar from "../SideBar";

export default function AppLayout() {
  return (
    <div className="grid h-screen grid-cols-1 sm:grid-cols-[4.5rem_1fr] lg:grid-cols-[18rem_1fr] bg-black">
      <div className="hidden sm:block overflow-hidden">
        <SideBar />
      </div>

      <main className="h-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
