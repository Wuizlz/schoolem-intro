import renderIcon from "./RenderIcon";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";

export default function SideLink({ to, label, icon, onClick }) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                [
                    "group flex gap-3 rounded-2xl px-3 py-2 text-sm leading-6 font-semibold",
                    isActive ? "bg-zinc-900 border border-zinc-900 text-white"
                        : "hover:bg-zinc-900 border border-transparent text-zinc-400",
                ].join(" ")
            }
        >
            <span className="h-8 w-8 grid place-content-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
            {renderIcon(icon)}
            </span>
            <span className="text-left flex-1">{label}</span>
        </NavLink>
    );
}
