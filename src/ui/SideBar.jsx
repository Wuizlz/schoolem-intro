import Logo from "../ui/Logo";
import MainNav from "../ui/MainNav";
import SchoolEm from "./SchoolEm";
import UniHolder from "./UniHolder";

export default function SideBar({ isAlertsOpen, setIsAlertsOpen }) {
  return (
    <aside className="flex min-h-screen w-full max-w-xs flex-col items-start  border-grey-100 border-r border-r-gray-600 bg-grey-700 text-grey-100 sm:max-w-sm lg:max-w-[24rem]">
      <Logo className="self-start p-4" />
      <div className={isAlertsOpen ? 'hidden' : 'hidden w-full lg:block'}>
        <SchoolEm />
        <UniHolder />
      </div>

      <div className="flex w-full flex-1 flex-col mt-10 px-1">
        <MainNav isAlertsOpen={isAlertsOpen} setIsAlertsOpen={setIsAlertsOpen} />
      </div>
    </aside>
  );
}
