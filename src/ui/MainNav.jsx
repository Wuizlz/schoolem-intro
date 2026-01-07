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
  color: inherit;
  background-color: currentColor;
  mask-image: url("/schoolemwhite_original.png");
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
  -webkit-mask-image: url("/schoolemwhite_original.png");
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
  transition: background-color 0.3s ease, color 0.3s ease;
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
  color: inherit;
  text-decoration: none;
  transition: background-color 0.3s ease, border-color 0.3s ease,
    color 0.3s ease;

  &:hover,
  &:focus-visible {
    border-color: var(--color-yellow-500);
    background-color: hsla(0, 0%, 100%, 0.06);
    outline: none;
  }

  &.active {
    border-color: var(--color-yellow-500);
  }

  & svg,
  & ${ProfileIcon} {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-50);
    fill: currentColor;
    flex-shrink: 0;
    transition: all 0.3s;
  }

  &:active ${ProfileIcon}, &.active svg,
  &.active ${ProfileIcon} {
    color: var(--color-amber-200);
  }

  span {
    transition: color 0.3s;
  }
  &:active span,
  &.active span {
    font-weight: bolder;
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
        border-radius: 999px;

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
        border-radius: 999px;
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
  &:active svg {
    color: var(--color-amber-200);
  }
  width: 100%;

  &:active svg {
    color: var(--color-amber-200);
  }
`;

export default function MainNav({ isAlertsOpen, setIsAlertsOpen }) {
  const { profile } = useAuth();
  const username = profile?.display_name 
  const { logout, isLoggingOut } = useLogout();

  const textClass = `hidden font-extralight text-amber-50 ${isAlertsOpen ? 'hidden' : 'hidden lg:inline'}`;

  return (
    <nav className="flex h-full w-full flex-1 flex-col">
      {/* ONE Menus provider wraps both Add and More */}
      <Menus>
        <ul className="flex flex-col gap-12">
          <li>
            <StyledNavLink to="/uni" onClick={() => setIsAlertsOpen && setIsAlertsOpen(false)} $forceCompact={isAlertsOpen}>
              <LiaUniversitySolid />
              <span className={textClass}>
                Uni
              </span>
            </StyledNavLink>
          </li>

          <li>
            <NavButton onClick={() => setIsAlertsOpen && setIsAlertsOpen(!isAlertsOpen)} className={isAlertsOpen ? 'active' : ''} $forceCompact={isAlertsOpen}>
              <IoIosNotifications />
              <span className={textClass}>
                Alerts
              </span>
            </NavButton>
          </li>

          <li>
            <StyledNavLink end to={username ? `/${username}` : "/"} onClick={() => setIsAlertsOpen && setIsAlertsOpen(false)} $forceCompact={isAlertsOpen}>
              <ProfileIcon aria-hidden="true" />
              <span className={textClass}>
                Profile
              </span>
            </StyledNavLink>
          </li>

          <li>
            <Modal>
              <AddNavButton id="add-ops" $forceCompact={isAlertsOpen}>
                <IoIosAddCircleOutline
                  aria-hidden="true"
                  className="h-[2.4rem] w-[2.4rem] shrink-0 text-grey-50 transition-colors duration-300"
                />
                <span className={`${textClass} transition-colors duration-300`}>
                  Add
                </span>
              </AddNavButton>

              <Menus.List id="add-ops">
                <Modal.Open opens="post">
                  <Menus.MButton
                    icon={
                      <MdAddToPhotos
                        color="white"
                        className="h-[1.4rem] w-[1.4rem] shrink-0 text-grey-50 transition-colors duration-300"
                      />
                    }
                  >
                    <span className="text-amber-50">Post</span>
                  </Menus.MButton>
                </Modal.Open>

                <Modal.Open opens="thread">
                  <Menus.MButton
                    icon={
                      <FaRegFileLines
                        color="white"
                        className="h-[1.4rem] w-[1.4rem] shrink-0 text-grey-50 transition-colors duration-300"
                      />
                    }
                  >
                    <span className="text-amber-50">Thread</span>
                  </Menus.MButton>
                </Modal.Open>

                <Modal.Open opens="quickie">
                  <Menus.MButton
                    icon={
                      <FaRegUserCircle
                        color="white"
                        className="h-[1.4rem] w-[1.4rem] shrink-0 text-grey-50 transition-colors duration-300"
                      />
                    }
                  >
                    <span className="text-amber-50">Quickie</span>
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
              <span className={textClass}>
                More
              </span>
            </AddNavButton>

            <Menus.List id="more">
              {" "}
              <Link to="/settings">
                <Menus.MButton
                  icon={
                    <IoSettingsOutline
                      className="h-[1.4rem] w-[1.4rem] shrink-0 text-grey-50 transition-colors duration-300"
                      color="white"
                    />
                  }
                >
                  <span className="text-amber-50">Settings</span>
                </Menus.MButton>{" "}
              </Link>
              <Menus.MButton
                onClick={logout}
                disabled={isLoggingOut}
                icon={
                  <BiSolidDoorOpen
                    className="h-[1.4rem] w-[1.4rem] shrink-0 text-grey-50 transition-colors duration-300"
                    color="white"
                  />
                }
              >
                <span className="text-amber-50">Log out</span>
              </Menus.MButton>
            </Menus.List>
          </li>
        </ul>
      </Menus>
    </nav>
  );
}
