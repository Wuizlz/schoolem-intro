import { useAuth } from "../hooks/useAuth";

export default function OwnUserStory() {
  const { profile } = useAuth();
  const avatarUrl = profile?.avatar_url;
  const username = profile?.display_name;

  return (
    <div className="flex flex-col ">
      <div className="h-16 w-16 rounded-full border border-zinc-600 p-[3px]">
        <img
          src={avatarUrl}
          alt={username ?? "Your story"}
          className="h-full w-full rounded-full object-cover py-5x"
        />
      </div>
      <span className="text-xs text-zinc-300 flex justify-center py-2" >{username ?? "You"}</span>
       
    </div>
    
  );
}