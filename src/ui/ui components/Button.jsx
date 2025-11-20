// ui/Button.jsx
import { Link } from "react-router-dom";

export default function Button({
  children,
  disabled,
  to,
  type = "primary",
  buttonType = "button",
  onClick,
  className = "",
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center text-sm rounded-full font-semibold " +
    "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 " +
    "disabled:opacity-50 disabled:cursor-not-allowed text-black";

  const styles = {
    primary: `${base} bg-amber-300 hover:bg-amber-500 px-4 py-3 md:px-6 md:py-4 `,
    modalButton:
      "group flex items-center gap-[1.2rem] px-[1.6rem] py-[0.8rem] rounded-full " +
      "border border-transparent transition-colors duration-300 text-inherit " +
      "hover:border-amber-500 hover:bg-white/10 focus-visible:border-amber-500 " +
      "focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-0",
    modalButtonAlternative:
      "group flex items-center gap-[1rem] px-[1rem] py-[0.3rem] rounded-full " +
      "border border-transparent transition-colors duration-300 text-inherit " +
      "hover:border-amber-500 hover:bg-white/10 focus-visible:border-amber-500 " +
      "focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-0",
    menusOpt:
      "group flex items-center gap-[1.2rem] px-[1.6rem] py-[0.8rem] rounded-full " +
      "border border-transparent transition-colors duration-300 text-inherit hover:cursor-pointer",
    settingsButton:
      "w-full text-left px-4 py-2.5 rounded-full transition-colors duration-200",
  };

  const selectedStyle = styles[type] ?? styles.primary;
  const cls = `${selectedStyle} ${className}`.trim();

  if (to) {
    // <Link> doesn't support disabled — simulate it
    return (
      <Link
        to={to}
        className={cls + (disabled ? " pointer-events-none" : "")}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={buttonType}
      onClick={onClick}
      disabled={disabled}
      className={cls}
      {...rest}
    >
      {children}
    </button>
  );
}
