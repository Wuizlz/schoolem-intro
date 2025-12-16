import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";

export default function Overlay({ children, onClose }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose(); // only when clicking outside content
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onMouseDown={handleBackdropClick}
    >
      <div
        className="relative w-[92vw] max-w-5xl rounded-2xl bg-zinc-900 border border-zinc-700 p-6"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-100"
        >
          <HiXMark/>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
