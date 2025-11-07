// src/ui/Modal.jsx
import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import useOutsideClick from "../hooks/useOutsideClick";

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

// Wrap any trigger (Button, NavItem, etc.)

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);
  // No cloneElement; wrap the child and listen for clicks on the wrapper
  return (
    <span className="inline-block" onClick={() => open(opensWindowName)}>
      {children}
    </span>
  );
}

// The actual modal window
function Window({ children, name, widthClass = "max-w-xl" }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-1000 grid place-items-center
                 bg-black/1 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={ref}
        className={`relative w-[92vw] ${widthClass} rounded-3xl border
                    border-zinc-700 bg-zinc-900 p-6 sm:p-8 shadow-2xl`}
      >
        <button
          onClick={close}
          className="absolute right-3.5 top-3.5 rounded-md p-2
                     text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          aria-label="Close modal"
        >
          <HiXMark className="h-6 w-6" />
        </button>

        {/* Inject onCloseModal into the child content */}
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </div>
    </div>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;
