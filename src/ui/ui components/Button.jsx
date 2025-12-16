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
  // Base styles for “normal” buttons, but NOT icon/comment buttons
  const base =
    type !== "iconButton" && type !== "commentButton"
      ? "inline-flex items-center justify-center text-sm rounded-full font-semibold " +
        "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-grey-50)] " +
        "disabled:opacity-50 disabled:cursor-not-allowed"
      : "";

  const styles = {
    primary: `${base} bg-[var(--color-accent)] text-black hover:opacity-90 px-4 py-3 md:px-6 md:py-4`,

    // ✅ you were using type="secondary" in CreatePostModal
    secondary: `${base} border border-[var(--color-grey-200)] bg-[var(--color-grey-0)] text-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)] px-4 py-3 md:px-6 md:py-4`,

    modalButton:
      "group flex items-center gap-[1.2rem] px-[1.6rem] py-[0.8rem] rounded-full " +
      "border border-transparent transition-colors duration-200 text-[var(--color-grey-900)] " +
      "hover:border-[var(--color-accent)] hover:bg-[var(--color-grey-100)] " +
      "focus-visible:border-[var(--color-accent)] focus-visible:bg-[var(--color-grey-100)] " +
      "focus-visible:outline-none focus-visible:ring-0",

    modalButtonAlternative:
      "group flex items-center gap-[1rem] px-[1rem] py-[0.3rem] rounded-full " +
      "border border-transparent transition-colors duration-200 text-[var(--color-grey-900)] " +
      "hover:border-[var(--color-accent)] hover:bg-[var(--color-grey-100)] " +
      "focus-visible:border-[var(--color-accent)] focus-visible:bg-[var(--color-grey-100)] " +
      "focus-visible:outline-none focus-visible:ring-0",

    menusOpt:
      "group flex items-center gap-[1.2rem] px-[1.2rem] py-[0.7rem] rounded-xl " +
      "border border-transparent transition-colors duration-150 text-[var(--color-grey-900)] hover:cursor-pointer",

    settingsButton:
      "w-full text-left px-4 py-2.5 rounded-full transition-colors duration-150 " +
      "text-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)]",

    iconButton:
      "transition-transform hover:scale-105 hover:cursor-pointer text-[var(--color-grey-700)] hover:text-[var(--color-grey-900)]",

    commentButton:
      "transition-transform hover:scale-105 hover:cursor-pointer hover:text-[var(--color-grey-900)] hover:font-bold",
  };

  const selectedStyle = styles[type] ?? styles.primary;
  const cls = `${selectedStyle} ${className}`.trim();

  if (to) {
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