import { Outlet } from "react-router-dom";
import SideBar from "../SideBar";
import { useEffect, useRef, useState } from "react";
import Alerts from "../../pages/Alerts";
import MobileNav from "../MobileNav";

export default function AppLayout() {
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const mobileScrollRef = useRef({ mainScrollTop: 0, windowScrollY: 0 });

  useEffect(() => {
    if (!isAlertsOpen) return;
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    if (!isMobile) return;

    const main = document.querySelector("main");
    mobileScrollRef.current = {
      mainScrollTop: main?.scrollTop ?? 0,
      windowScrollY: window.scrollY,
    };
  
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalMainOverflow = main?.style.overflow;

   
    document.documentElement.style.overflow = "hidden";
    if (main) main.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      if (main) {
        main.style.overflow = originalMainOverflow ?? "";
        main.scrollTop = mobileScrollRef.current.mainScrollTop;
      }
      window.scrollTo(0, mobileScrollRef.current.windowScrollY);
    };
  }, [isAlertsOpen]);

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

      <div
        className={`fixed inset-0 z-30 transition-opacity duration-300 sm:hidden  ${
          isAlertsOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isAlertsOpen}
      >
        <button
          type="button"
          aria-label="Close alerts"
          onClick={() => setIsAlertsOpen(false)}
          className="absolute left-0 right-0 top-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] bg-black/60"
        />

        <div
          role="dialog"
          aria-modal="true"
          className={`absolute left-0 right-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] mx-2 h-[75vh] max-h-[80vh] rounded-t-3xl border border-gray-800 bg-black shadow-2xl transition-transform duration-300 ${
            isAlertsOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex items-center justify-center pt-3 pb-2">
            <button
              type="button"
              aria-label="Close alerts"
              onClick={() => setIsAlertsOpen(false)}
              className="h-1.5 w-12 rounded-full bg-zinc-600"
            />
          </div>
          <div className="h-[calc(100%-2.25rem)] overflow-hidden">
            <Alerts variant="sheet" />
          </div>
        </div>
      </div>

      <MobileNav isAlertsOpen={isAlertsOpen} setIsAlertsOpen={setIsAlertsOpen} />
    </div>
  );
}
