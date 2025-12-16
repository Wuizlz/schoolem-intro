import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";

export default function Overlay({ children, onClose }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ backgroundColor: "var(--overlay-bg)" }}
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-[92vw] max-w-5xl rounded-2xl bg-[var(--color-grey-0)] border border-[var(--color-grey-200)] p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-2 text-[var(--color-grey-500)] hover:bg-[var(--color-grey-100)] hover:text-[var(--color-grey-900)]"
          aria-label="Close"
        >
          <HiXMark className="h-6 w-6" />
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
}