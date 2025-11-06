import { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import Button from "./Button";
import useOutsideClick from "../hooks/useOutsideClick";

const MENU_HORIZONTAL_OFFSET = 35;
const MENU_VERTICAL_OFFSET = 0;

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
  gap: 0.4rem;
  min-width: 10rem;
  padding: 0.8rem 0.4rem;
  background-color: #262626;
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-md);
  
  right: ${({ position }) => position?.x ?? 0}px;
  top: ${({ position }) => position?.y ?? 0}px;
`;

const MenusContext = createContext();

export default function Menus({ children }) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });

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
    const rawRight = window.innerWidth - rect.right;

    setPosition({
      x: Math.max(0, rawRight - MENU_HORIZONTAL_OFFSET),
      y: rect.bottom + MENU_VERTICAL_OFFSET,
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

function MButton({ children, icon, onClick }) {
  const { close } = useContext(MenusContext);

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <Button type="modalButton" onClick={handleClick}>
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
