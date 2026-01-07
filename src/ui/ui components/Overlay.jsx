import { createPortal } from "react-dom";
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
                   md:h-(--max-h-md) lg:h-(--max-h-lg)"
        style={{
          "--max-h": `${bH}vh`,
          "--max-h-sm": `${smH}vh`,
          "--max-h-md": `${mdH}vh`,
          "--max-h-lg": `${lgH}vh`,
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
