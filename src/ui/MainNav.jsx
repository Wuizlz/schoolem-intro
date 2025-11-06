import { IoIosAddCircleOutline, IoIosNotifications } from "react-icons/io";
import { LiaUniversitySolid } from "react-icons/lia";

import { NavLink } from "react-router-dom";
import styled from "styled-components";
import Button from "./Button";
import CreatePostModal from "./CreatePostModal";
import Modal from "./Modal";

const ProfileIcon = styled.span`
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
const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    padding: 0.8rem 1.6rem;
    border-radius: 999px;
    border: 1px solid transparent;
    transition: background-color 0.3s ease, border-color 0.3s ease,
      color 0.3s ease;

    /* color: var(--color-grey-50);
    font-size: 1.6rem;

    transition: all 0.3s;
    font-weight: bold; */
  }

  &:hover,
  &:focus-visible {
    border-color: var(--color-yellow-500);
    background-color: hsla(0, 0%, 100%, 0.06);
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
    color: var(--color-yellow-500);
  }

  span {
    transition: color 0.3s;
  }

  &:active span,
  &.active span {
    font-weight: bolder;
  }
`;

export default function MainNav() {
  return (
    <nav>
      <ul className="flex flex-col gap-8 sm:gap-12 ">
        <li>
          <StyledNavLink to="/uni">
            <LiaUniversitySolid />
            <span className="font-extralight text-amber-50">Uni</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/alerts">
            <IoIosNotifications />
            <span className="font-extralight  text-amber-50">Alerts</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/profile">
            <ProfileIcon aria-hidden="true" />

            <span className="font-extralight  text-amber-50">Profile</span>
          </StyledNavLink>
        </li>
        <li>
          <Modal>
            <Modal.Open opens="create-post">
              <Button type="modalButton" className="text-grey-50">
                <IoIosAddCircleOutline color="white"
                  aria-hidden="true"
                  className="h-[2.4rem] w-[2.4rem] shrink-0 text-grey-50 transition-colors duration-300"
                />
                <span className="font-extralight text-amber-50 transition-colors duration-300">
                  Add
                </span>
              </Button>
            </Modal.Open>
            <Modal.Window name="create-post">
              <CreatePostModal />
            </Modal.Window>
          </Modal>
        </li>
      </ul>
    </nav>
  );
}
