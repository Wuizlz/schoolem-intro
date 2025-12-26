import { useAuth } from "../../hooks/useAuth";

export default function OwnUserCircle({ type }) {
  const { profile } = useAuth();
  const avatarUrl = profile?.avatar_url;
  const username = profile?.display_name;

  const baseImg = "rounded-full object-cover h-full w-full ";

  const containerStyles = {
    uniStyle:
      "h-20 w-20 rounded-full   p-[3px] shadow-[0_0_25px_-10px_rgb(245_158_11)]",
    editStyle: "h-35 w-35 rounded-full  p-[3px] ",
  };

  return (
    <div className="flex flex-col">
      <div className={containerStyles[type]}>
        <img
          src={avatarUrl}
          alt={username ?? "Your story"}
          className={baseImg}
        />
      </div>
      {type === "uniStyle" && (
        <span className="text-xs text-zinc-300 flex justify-center py-2">
          {username ?? "You"}
        </span>
      )}
    </div>
  );
}
