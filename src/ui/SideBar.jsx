import Logo from "../ui/Logo";
import MainNav from "../ui/MainNav";
import SchoolEm from "./SchoolEm";
import UniHolder from "./UniHolder";

export default function SideBar({ isAlertsOpen, setIsAlertsOpen }) {
  return (
    <aside className="flex min-h-screen w-full max-w-xs flex-col items-start border-r border-[var(--color-grey-200)] bg-[var(--color-grey-0)] text-[var(--color-grey-900)] sm:max-w-sm lg:max-w-[24rem]">
      <Logo className="self-start p-4" />

      <div className={isAlertsOpen ? "hidden" : "hidden w-full lg:block"}>
        <SchoolEm />
        <UniHolder />
      </div>

      <div className="flex w-full flex-1 flex-col mt-10 px-1">
        <MainNav isAlertsOpen={isAlertsOpen} setIsAlertsOpen={setIsAlertsOpen} />
      </div>
    </aside>
  );
}