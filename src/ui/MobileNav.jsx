import { NavLink } from "react-router-dom";
import { LiaUniversitySolid } from "react-icons/lia";
import { IoIosAddCircleOutline, IoIosNotifications } from "react-icons/io";
import { MdAddToPhotos } from "react-icons/md";
import { FaRegFileLines } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";

import Modal from "./ui components/Modal";
import Menus from "./ui components/Menus";
import CreatePostModal from "./pop-ups/CreatePostModal";
import CreateThreadForm from "./pop-ups/CreateThreadModal";
import { useAuth } from "../hooks/useAuth";
import { ProfileIcon } from "./MainNav";

const navItemBase =
  "flex flex-col items-center justify-center gap-1 text-[0.7rem] transition-colors";

export default function MobileNav({ isAlertsOpen, setIsAlertsOpen }) {
  const { profile } = useAuth();
  const username = profile?.display_name;

  const labelClass = (isActive) =>
    `text-amber-50 ${isActive ? "font-bold" : "font-normal"}`;

  const iconClass = (isActive) =>
    isActive ? "text-[var(--color-amber-200)]" : "text-amber-50";

  const profileStyle = (isActive) => ({
    color: isActive ? "var(--color-amber-200)" : "var(--color-amber-50)",
    width: "1.75rem",
    height: "1.75rem",
  });

  const alertsClass = isAlertsOpen
    ? `${navItemBase} font-bold`
    : `${navItemBase} font-normal`;

  return (
    <nav className="fixed bottom-0  left-0 right-0 z-40 border-t border-gray-800 bg-grey-700/95 backdrop-blur sm:hidden">
      <Menus>
        <ul className="flex items-center justify-around px-6 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          <li>
            <NavLink
              to="/uni"
              className={navItemBase}
              aria-label="Uni"
              onClick={() => setIsAlertsOpen?.(false)}
            >
              {({ isActive }) => (
                <>
                  <LiaUniversitySolid className={`h-7 w-7 ${iconClass(isActive)}`} />
                  <span className={labelClass(isActive)}>Uni</span>
                </>
              )}
            </NavLink>
          </li>

          <li>
            <button
              type="button"
              className={alertsClass}
              aria-label="Alerts"
              onClick={() => setIsAlertsOpen?.((open) => !open)}
            >
              <IoIosNotifications className={`h-7 w-7 ${iconClass(isAlertsOpen)}`} />
              <span className={labelClass(isAlertsOpen)}>Alerts</span>
            </button>
          </li>

          <li>
            <Modal>
              <Menus.Toggle
                id="add-ops-mobile"
                align="center"
                className={`${navItemBase} font-normal`}
              >
                <IoIosAddCircleOutline className="h-7 w-7 text-amber-50" />
                <span className="text-amber-50 font-normal">Post</span>
              </Menus.Toggle>

              <Menus.List id="add-ops-mobile">
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

          <li>
            <NavLink
              end
              to={username ? `/${username}` : "/"}
              className={navItemBase}
              aria-label="Profile"
              onClick={() => setIsAlertsOpen?.(false)}
            >
              {({ isActive }) => (
                <>
                  <ProfileIcon aria-hidden="true" style={profileStyle(isActive)} />
                  <span className={labelClass(isActive)}>Profile</span>
                </>
              )}
            </NavLink>
          </li>
        </ul>
      </Menus>
    </nav>
  );
}
