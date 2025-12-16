import { useAuth } from "../../hooks/useAuth";

export default function OwnUserCircle({ type }) {
  const { profile } = useAuth();
  const avatarUrl = profile?.avatar_url;
  const username = profile?.display_name;

  const baseImg = "rounded-full object-cover h-full w-full";

  const containerStyles = {
    uniStyle:
      "h-25 w-25 rounded-full p-[3px] border border-amber-500/25 bg-[var(--color-grey-0)] shadow-[0_0_25px_-10px_rgb(245_158_11)]",
    editStyle: "h-35 w-35 rounded-full p-[3px] border border-[var(--color-grey-200)] bg-[var(--color-grey-0)]",
  };

  return (
    <div className="flex flex-col">
      <div className={containerStyles[type]}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={username ?? "Your story"} className={baseImg} />
        ) : (
          <div className="h-full w-full rounded-full bg-[var(--color-grey-100)]" />
        )}
      </div>

      {type === "uniStyle" && (
        <span className="text-xs text-[var(--color-grey-600)] flex justify-center py-2">
          {username ?? "You"}
        </span>
      )}
    </div>
  );
}