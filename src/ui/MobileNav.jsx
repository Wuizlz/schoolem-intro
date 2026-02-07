import { NavLink } from "react-router-dom";
import { LiaUniversitySolid } from "react-icons/lia";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdAddToPhotos } from "react-icons/md";
import { FaRegFileLines } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";

import Modal from "./ui components/Modal";
import Menus from "./ui components/Menus";
import CreatePostModal from "./pop-ups/CreatePostModal";
import CreateThreadForm from "./pop-ups/CreateThreadModal";
import { useAuth } from "../hooks/useAuth";

const navItemBase =
  "flex flex-col items-center justify-center gap-1 text-[0.7rem] transition-colors text-amber-50  ";

export default function MobileNav() {
  const { profile } = useAuth();
  const username = profile?.display_name;

  const linkClass = ({ isActive }) =>
    `${navItemBase} ${
      isActive ? " font-extrabold" : "font-extralight "
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-800 bg-grey-700/95 backdrop-blur sm:hidden">
      <Menus>
        <ul className="flex items-center justify-around px-6 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          <li>
            <NavLink to="/uni" className={linkClass} aria-label="Uni">
              <LiaUniversitySolid className="h-8 w-8" />
              <span>Uni</span>
            </NavLink>
          </li>

          <li>
            <Modal>
              <Menus.Toggle
                id="add-ops-mobile"
                align="center"
                className={`${navItemBase} text-zinc-200`}
              >
                <IoIosAddCircleOutline className="h-8 w-8" />
                <span>Post</span>
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
              className={linkClass}
              aria-label="Profile"
            >
              <img src="/schoolemwhite_original.png" className="h-8 w-8" />
              <span>Profile</span>
            </NavLink>
          </li>
        </ul>
      </Menus>
    </nav>
  );
}
