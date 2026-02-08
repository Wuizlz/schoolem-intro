import { createPortal } from "react-dom";
import { useEffect } from "react";
import { HiXMark } from "react-icons/hi2";

export default function Overlay({
  children,
  onClose,
  element,
  smW = "90",
  side = "vw",
  bH = "78",
  smH = "68",
  mdH = "79",
  lgH = "88",
}) {
  useEffect(() => {
    const main = document.querySelector("main");
    const scrollY = window.scrollY;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyWidth = document.body.style.width;
    const originalBodyTop = document.body.style.top;
    const originalBodyPaddingRight = document.body.style.paddingRight;
    const originalBodyTouchAction = document.body.style.touchAction;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalMainOverflow = main?.style.overflow;
    const originalMainTouchAction = main?.style.touchAction;
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.touchAction = "none";
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
    if (main) {
      main.style.overflow = "hidden";
      main.style.touchAction = "none";
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.width = originalBodyWidth;
      document.body.style.top = originalBodyTop;
      document.body.style.paddingRight = originalBodyPaddingRight;
      document.body.style.touchAction = originalBodyTouchAction;
      document.documentElement.style.overflow = originalHtmlOverflow;
      if (main) {
        main.style.overflow = originalMainOverflow ?? "";
        main.style.touchAction = originalMainTouchAction ?? "";
      }
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose(); // only when clicking outside content
  };

  return createPortal(
    <div
      className="fixed inset-0  bg-black/50 flex items-center justify-center "
      onMouseDown={handleBackdropClick}
    >
      <div
        className="flex flex-col relative w-(--max-w-sm) rounded-2xl bg-zinc-900 border border-zinc-700 p-2
                   h-(--max-h) sm:h-(--max-h-sm)
                   md:h-(--max-h-md) lg:h-(--max-h-lg)
                   [--mobile-nav:calc(4.25rem+env(safe-area-inset-bottom))] sm:[--mobile-nav:0px]"
        style={{
          "--max-h": `min(${bH}dvh, calc(100dvh - var(--mobile-nav)))`,
          "--max-h-sm": `min(${smH}dvh, calc(100dvh - var(--mobile-nav)))`,
          "--max-h-md": `min(${mdH}dvh, calc(100dvh - var(--mobile-nav)))`,
          "--max-h-lg": `min(${lgH}dvh, calc(100dvh - var(--mobile-nav)))`,
          "--max-w-sm": `${smW}${side}`,
        }}
      >
        {element}
        <button
          onClick={onClose}
          className="absolute right-1 top-1 text-zinc-400 hover:text-zinc-100"
        >
          <HiXMark />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
