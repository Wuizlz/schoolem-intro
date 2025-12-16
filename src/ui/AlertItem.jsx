import { formatRelative } from "../utils/helpers";

export default function AlertItem({ item }) {
  let text = "";
  switch (item.action_type) {
    case "like":
      text = "liked your post.";
      break;
    case "comment":
      text = "commented on your post.";
      break;
    case "follow":
      text = "started following you.";
      break;
    default:
      text = "interacted with you.";
  }

  return (
    <li className="flex items-center gap-4 py-3">
      <div className="relative">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-[var(--color-grey-100)] border border-[var(--color-grey-200)]">
           {item.actor_avatar ? (
             <img src={item.actor_avatar} alt={item.actor_name} className="h-full w-full object-cover" />
           ) : (
             <div className="h-full w-full bg-[var(--color-grey-100)] flex items-center justify-center text-xs text-[var(--color-grey-500)]">
               {item.actor_name ? item.actor_name[0].toUpperCase() : '?'}
             </div>
           )}
        </div>
      </div>
      <div className="flex-1 text-sm text-[var(--color-grey-700)]">
        <span className="font-bold text-[var(--color-grey-900)]">
          {item.actor_name}
        </span>{" "}
        <span className="text-[var(--color-grey-500)]">{text}</span>{" "}
        <span className="text-[var(--color-grey-500)]">{formatRelative(item.created_at)}</span>
      </div>
    </li>
  );
}