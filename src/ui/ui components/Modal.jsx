import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import useOutsideClick from "../../hooks/useOutsideClick";

const ModalContext = createContext();

export default function Modal({ children }) {
  const [openName, setOpenName] = useState("");
  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  return (
    <span
      className="inline-block"
      onClick={() => open(opensWindowName)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") open(opensWindowName);
      }}
    >
      {children}
    </span>
  );
}

function Window({ children, name, widthClass = "max-w-xl" }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] grid place-items-center backdrop-blur-sm"
      style={{ backgroundColor: "var(--overlay-bg)" }}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={ref}
        className={`relative w-[92vw] ${widthClass} rounded-3xl border
          border-[var(--color-grey-200)] bg-[var(--color-grey-0)] p-6 sm:p-8 shadow-2xl`}
      >
        <button
          onClick={close}
          className="absolute right-3.5 top-3.5 rounded-md p-2
            text-[var(--color-grey-500)] hover:bg-[var(--color-grey-100)] hover:text-[var(--color-grey-900)]"
          aria-label="Close modal"
          type="button"
        >
          <HiXMark className="h-6 w-6" />
        </button>

        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </div>
    </div>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;
