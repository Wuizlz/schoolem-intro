import { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import Button from "./Button";
import useOutsideClick from "../hooks/useOutsideClick";

const PANEL_MIN_WIDTH = 100; // 12rem (smaller than before)
const VIEWPORT_MARGIN = 10;  // keep panel off screen edges
const GAP = 4;               // distance from trigger (smaller/closer)

const MenusContext = createContext();

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledList = styled.ul`
  position: fixed;
  z-index: 50;

  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  /* Smaller panel */
  min-width: 10rem;
  padding: 0.2rem;
  background-color: #18181b;     /* dark panel */
  border: 1px solid #3f3f46;     /* zinc-700-ish */
  border-radius: 14px;           /* rounded like your selects */
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.5);

  left: ${({ position }) => position?.left ?? 0}px;
  top: ${({ position }) => position?.top ?? 0}px;

  /* Place above or below without guessing height */
  transform: translateY(
    ${({ position }) =>
      position?.placement === "above"
        ? `calc(-100% - ${GAP}px)`
        : `${GAP}px`}
  );
`;

export default function Menus({ children }) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    placement: "below",
  });

  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <MenusContext.Provider value={{ openId, position, setPosition, close, open }}>
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ id, children, className, onActiveChange, ...rest }) {
  const { openId, open, close, setPosition } = useContext(MenusContext);
  const isOpen = openId === id;

  useEffect(() => {
    onActiveChange?.(isOpen);
  }, [isOpen, onActiveChange]);

  function handleClick(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    // Bottom "More" opens above; others open below.
    const placement = id === "more" ? "above" : "below";

    // Clamp left so the panel stays in the viewport.
    const unclampedLeft = rect.left;
    const maxLeft = window.innerWidth - PANEL_MIN_WIDTH - VIEWPORT_MARGIN;
    const left = Math.min(
      Math.max(VIEWPORT_MARGIN, unclampedLeft),
      Math.max(VIEWPORT_MARGIN, maxLeft)
    );

    const top = placement === "above" ? rect.top : rect.bottom;

    setPosition({ left, top, placement });

    if (isOpen) close();
    else open(id);
  }

  function onKeyDown(e) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(e);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={onKeyDown}
      className={className}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      data-state={isOpen ? "open" : "closed"}
      data-menu-toggle
      {...rest}
    >
      {children}
    </button>
  );
}

function List({ id, children }) {
  const { openId, position, close } = useContext(MenusContext);
  const ref = useOutsideClick(close, "[data-menu-toggle]");

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  if (openId !== id) return null;

  return createPortal(
    <StyledList ref={ref} position={position} role="menu" aria-orientation="vertical">
      {children}
    </StyledList>,
    document.body
  );
}

function MButton({ children, icon, onClick, disabled }) {
  const { close } = useContext(MenusContext);

  async function handleClick() {
    if (disabled) return;
    try {
      await onClick?.();
    } finally {
      close();
    }
  }

  return (
    <li role="none">
      <Button
        type="menusOpt"               // <-- your original button style
        role="menuitem"
        onClick={handleClick}
        disabled={disabled}
        className="w-full flex items-center gap-3 rounded-xl px-3 py-2"
      >
        {icon}
        <span className="ml-2">{children}</span>
      </Button>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.MButton = MButton;
Menus.Button = Button;
