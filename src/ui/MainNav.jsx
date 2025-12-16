import { IoIosAddCircleOutline, IoIosNotifications } from "react-icons/io";
import { LiaUniversitySolid } from "react-icons/lia";
import { MdAddToPhotos } from "react-icons/md";
import { FaRegFileLines } from "react-icons/fa6";
import { Link, NavLink } from "react-router-dom";
import styled, { css } from "styled-components";

import Modal from "./ui components/Modal";
import Menus from "./ui components/Menus";
import CreatePostModal from "./pop-ups/CreatePostModal";
import { FaRegUserCircle } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoSettingsOutline } from "react-icons/io5";
import { BiSolidDoorOpen } from "react-icons/bi";
import useLogout from "../hooks/useLogout";
import CreateThreadForm from "./pop-ups/CreateThreadModal";
import { useAuth } from "../hooks/useAuth";

export const ProfileIcon = styled.span`
  width: 2.4rem;
  height: 2.4rem;
  flex-shrink: 0;
  display: inline-block;
  background-color: currentColor;
  mask-image: url("/schoolemwhite_original.png");
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
  -webkit-mask-image: url("/schoolemwhite_original.png");
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
  transition: background-color 0.3s ease;
`;

export const navItemStyles = css`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1.1rem;
  padding: 0.8rem 0.8rem;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-grey-700);
  text-decoration: none;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  &:hover,
  &:focus-visible {
    border-color: var(--color-accent);
    background-color: var(--color-grey-100);
    outline: none;
  }

  &.active {
    border-color: var(--color-accent);
  }

  & svg,
  & ${ProfileIcon} {
    width: 2.4rem;
    height: 2.4rem;
    color: currentColor;
    fill: currentColor;
    flex-shrink: 0;
    transition: color 0.2s ease, transform 0.2s ease;
  }

  &.active svg,
  &.active ${ProfileIcon} {
    color: var(--color-accent);
  }

  span {
    transition: color 0.2s ease;
  }

  &.active span {
    font-weight: 700;
    color: var(--color-grey-900);
  }

  ${({ $compactOnMobile = true }) =>
    $compactOnMobile &&
    css`
      @media (max-width: 1023px) {
        width: 3.6rem;
        height: 3.6rem;
        padding: 0.6rem;
        gap: 0;
        justify-content: center;

        &:hover,
        &:focus-visible {
          border-color: transparent;
          background-color: transparent;
        }

        &.active {
          border-color: transparent;
          background-color: transparent;
        }
      }
    `}

  ${({ $forceCompact }) =>
    $forceCompact &&
    css`
      width: 3.6rem;
      height: 3.6rem;
      padding: 0.6rem;
      gap: 0;
      justify-content: center;
      margin: 0 auto;

      &:hover,
      &:focus-visible {
        border-color: transparent;
        background-color: transparent;
      }

      &.active {
        border-color: transparent;
        background-color: transparent;
      }
    `}
`;

export const StyledNavLink = styled(NavLink)`
  ${navItemStyles};
`;

const NavButton = styled.div`
  ${navItemStyles};
  cursor: pointer;
`;

const AddNavButton = styled(Menus.Toggle).attrs({ align: "left" })`
  ${navItemStyles};
  cursor: pointer;
  width: 100%;
`;

export default function MainNav({ isAlertsOpen, setIsAlertsOpen }) {
  const { profile } = useAuth();
  const username = profile?.display_name;
  const { logout, isLoggingOut } = useLogout();

  const labelClass = isAlertsOpen
    ? "hidden"
    : "hidden lg:inline font-extralight text-[var(--color-grey-700)]";

  return (
    <nav className="flex h-full w-full flex-1 flex-col">
      <Menus>
        <ul className="flex flex-col gap-12">
          <li>
            <StyledNavLink
              to="/uni"
              onClick={() => setIsAlertsOpen(false)}
              $forceCompact={isAlertsOpen}
            >
              <LiaUniversitySolid />
              <span className={labelClass}>Uni</span>
            </StyledNavLink>
          </li>

          <li>
            <NavButton
              onClick={() => setIsAlertsOpen((v) => !v)}
              className={isAlertsOpen ? "active" : ""}
              $forceCompact={isAlertsOpen}
            >
              <IoIosNotifications />
              <span className={labelClass}>Alerts</span>
            </NavButton>
          </li>

          <li>
            <StyledNavLink
              to={username ? `/${username}` : "/"}
              onClick={() => setIsAlertsOpen(false)}
              $forceCompact={isAlertsOpen}
            >
              <ProfileIcon aria-hidden="true" />
              <span className={labelClass}>Profile</span>
            </StyledNavLink>
          </li>

          <li>
            <Modal>
              <AddNavButton id="add-ops" $forceCompact={isAlertsOpen}>
                <IoIosAddCircleOutline aria-hidden="true" />
                <span className={labelClass}>Add</span>
              </AddNavButton>

              <Menus.List id="add-ops">
                <Modal.Open opens="post">
                  <Menus.MButton icon={<MdAddToPhotos className="h-5 w-5" />}>
                    Post
                  </Menus.MButton>
                </Modal.Open>

                <Modal.Open opens="thread">
                  <Menus.MButton icon={<FaRegFileLines className="h-5 w-5" />}>
                    Thread
                  </Menus.MButton>
                </Modal.Open>

                <Modal.Open opens="quickie">
                  <Menus.MButton icon={<FaRegUserCircle className="h-5 w-5" />}>
                    Quickie
                  </Menus.MButton>
                </Modal.Open>
              </Menus.List>

              <Modal.Window name="post">
                <CreatePostModal />
              </Modal.Window>

              <Modal.Window name="thread">
                <CreateThreadForm />
              </Modal.Window>
            </Modal>
          </li>
        </ul>

        <ul className="mt-auto pt-12 sm:pt-16">
          <li>
            <AddNavButton id="more" $forceCompact={isAlertsOpen}>
              <RxHamburgerMenu />
              <span className={labelClass}>More</span>
            </AddNavButton>

            <Menus.List id="more">
              <Menus.MButton to="/settings" icon={<IoSettingsOutline className="h-5 w-5" />}>
                Settings
              </Menus.MButton>

              <Menus.MButton
                onClick={logout}
                disabled={isLoggingOut}
                icon={<BiSolidDoorOpen className="h-5 w-5" />}
              >
                Log out
              </Menus.MButton>
            </Menus.List>
          </li>
        </ul>
      </Menus>
    </nav>
  );
}