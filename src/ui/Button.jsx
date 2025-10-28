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
    "focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 " +
    "disabled:opacity-50 disabled:cursor-not-allowed text-black";

  const styles = {
    primary: `${base} bg-yellow-400 hover:bg-yellow-300 px-4 py-3 md:px-6 md:py-4 `,
    small:   `${base} bg-yellow-400 hover:bg-yellow-300 py-2 px-4 md:px-5 md:py-2.5 text-xs`,
    round:   `${base} bg-yellow-400 hover:bg-yellow-300 py-1 px-2.5 md:px-5 md:py-2.5 text-sm`,
    secondary:
      "inline-flex items-center justify-center text-sm rounded-full " +
      "border-2 border-stone-400 hover:bg-stone-50/10 " +
      "focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 " +
      "disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 md:px-6 md:py-3.5",
  };

  const cls = `${styles[type] ?? styles.primary} ${className}`;

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