import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

export default function AppLayout() {
  return (
    <div className="grid grid-cols-[13rem_1fr] grid-rows-[auto1fr] h-screen bg-black ">
      <SideBar />
      <main className="overflow-scroll">
        <Outlet />
      </main>
    </div>
  );
}
