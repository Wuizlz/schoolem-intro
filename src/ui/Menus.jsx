import { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import Button from "./Button";
import useOutsideClick from "../hooks/useOutsideClick";



const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledList = styled.ul`
  position: fixed;
  z-index: 20;
  display: flex;
  flex-direction: column;
  min-width: 10rem;
  max-width: calc(100vw - 2rem);
  background-color: #262626;
  box-shadow: var(--shadow-sm);
  border-radius: 10px;
  left: ${({ position }) => position?.x ?? 0}px;
  top: ${({ position }) => position?.y ?? 0}px;
  transform: translate(
    -50%,
    ${({ position }) => (position?.placement === "top" ? "-100%" : "0")}
  );
`;

const MenusContext = createContext();

export default function Menus({ children }) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    placement: "bottom",
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
    const viewportPadding = 16;
    const gap = 12;
    const estimatedMenuHeight = 200;
    const centerX = rect.left + rect.width / 2;
    const clampedX = Math.min(
      window.innerWidth - viewportPadding,
      Math.max(viewportPadding, centerX)
    );
    const spaceBelow = window.innerHeight - rect.bottom;
    const placement =
      spaceBelow < estimatedMenuHeight ? "top" : "bottom";
    const y =
      placement === "bottom" ? rect.bottom + gap : rect.top - gap;

    setPosition({
      x: clampedX,
      y,
      placement,
    });

    if (isOpen) {
      close();
    } else {
      open(id);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
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

  if (openId !== id) return null;

  return createPortal(
    <StyledList ref={ref} position={position}>
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
    <li>
      <Button type="menusOpt" onClick={handleClick} disabled={disabled}>
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
