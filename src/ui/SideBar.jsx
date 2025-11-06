import Logo from "../ui/Logo";
import MainNav from "../ui/MainNav";
import SchoolEm from "./SchoolEm";
import UniHolder from "./UniHolder";

export default function SideBar() {
  return (
    <aside className="flex min-h-screen w-full max-w-xs flex-col items-start overflow-y-auto border-grey-100 border-r border-r-gray-600 bg-grey-700 text-grey-100 sm:max-w-sm lg:max-w-[24rem]">
      <Logo className="self-start p-4" />
      <div className="w-full">
        <SchoolEm />
        <UniHolder />
      </div>

      <div className="w-full px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <MainNav />
      </div>
    </aside>
  );
}
