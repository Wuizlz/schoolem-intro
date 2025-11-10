import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

export default function AppLayout() {
  return (
    <div className="grid grid-cols-[13rem_1fr]  h-screen bg-black ">
      <div className="overflow-hidden">
        <SideBar />
      </div>

      <main className="h-full overflow-y-auto ">
        <Outlet />
      </main>
    </div>
  );
}
