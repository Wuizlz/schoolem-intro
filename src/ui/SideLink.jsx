import renderIcon from "./RenderIcon";
import { NavLink } from "react-router-dom";

/**
 * SideLink
 * - If `to` is provided, renders a NavLink (route-aware, active styles).
 * - If `to` is NOT provided, renders a button (perfect for modal triggers).
 */
export default function SideLink({ to, label, icon, onClick }) {
  const classes = ({ isActive } = { isActive: false }) =>
    [
      "group flex gap-3 rounded-2xl px-3 py-2 text-sm leading-6 font-semibold",
      isActive
        ? "bg-zinc-900 border border-zinc-900 text-white"
        : "hover:bg-zinc-900 border border-transparent text-zinc-400",
    ].join(" ");

  const content = (
    <>
      <span className="h-8 w-8 grid place-content-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
        {renderIcon(icon)}
      </span>
      <span className="text-left flex-1">{label}</span>
    </>
  );

  // Link version (route)
  if (to) {
    return (
      <NavLink to={to} onClick={onClick} className={classes}>
        {content}
      </NavLink>
    );
  }

  // Button version (no navigation)
  return (
    <button type="button" onClick={onClick} className={classes()}>
      {content}
    </button>
  );
}
