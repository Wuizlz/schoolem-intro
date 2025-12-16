import { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import Button from "./Button";
import useOutsideClick from "../../hooks/useOutsideClick";

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

  min-width: 10rem;
  max-width: calc(100vw - 2rem);

  background-color: var(--color-grey-0);
  color: var(--color-grey-900);
  border: 1px solid var(--color-grey-200);

  box-shadow: var(--shadow-sm);
  border-radius: 12px;

  padding: 0.4rem;
  overflow: hidden;

  left: ${({ $position }) => $position?.x ?? 0}px;
  top: ${({ $position }) => $position?.y ?? 0}px;
  transform: translate(
    ${({ $position }) => ($position?.align === "center" ? "-50%" : "0")},
    ${({ $position }) => ($position?.placement === "top" ? "-100%" : "0")}
  );
`;

export default function Menus({ children }) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    placement: "bottom",
    align: "center",
  });

  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <MenusContext.Provider value={{ openId, position, setPosition, close, open }}>
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ id, children, className, onActiveChange, align = "center", ...rest }) {
  const { openId, open, close, setPosition } = useContext(MenusContext);
  const isOpen = openId === id;

  useEffect(() => {
    onActiveChange?.(isOpen);
  }, [isOpen, onActiveChange]);

  function handleClick(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    const viewportPadding = 16;
    const gap = 12;
    const estimatedMenuHeight = 200;

    const computedStyles = window.getComputedStyle(button);
    const paddingLeft = parseFloat(computedStyles.paddingLeft) || 0;

    const anchorX =
      align === "left" ? rect.left + paddingLeft : rect.left + rect.width / 2;

    const clampedX = Math.min(
      window.innerWidth - viewportPadding,
      Math.max(viewportPadding, anchorX)
    );

    const spaceBelow = window.innerHeight - rect.bottom;
    const placement = spaceBelow < estimatedMenuHeight ? "top" : "bottom";
    const y = placement === "bottom" ? rect.bottom + gap : rect.top - gap;

    setPosition({ x: clampedX, y, placement, align });

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
    <StyledList ref={ref} $position={position} role="menu" aria-orientation="vertical">
      {children}
    </StyledList>,
    document.body
  );
}

function MButton({ children, icon, onClick, disabled, to }) {
  const { close } = useContext(MenusContext);

  async function handleClick(e) {
    if (disabled) return;
    try {
      await onClick?.(e);
    } finally {
      close();
    }
  }

  return (
    <li role="none">
      <Button
        type="menusOpt"
        to={to}
        role="menuitem"
        onClick={handleClick}
        disabled={disabled}
        className="w-full flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-[var(--color-grey-100)] text-[var(--color-grey-700)]"
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