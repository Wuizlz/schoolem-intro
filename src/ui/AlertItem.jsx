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
        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-700">
           {item.actor_avatar ? (
             <img src={item.actor_avatar} alt={item.actor_name} className="h-full w-full object-cover" />
           ) : (
             <div className="h-full w-full bg-gray-600 flex items-center justify-center text-xs text-gray-400">
               {item.actor_name ? item.actor_name[0].toUpperCase() : '?'}
             </div>
           )}
        </div>
      </div>
      <div className="flex-1 text-sm text-gray-200">
        <span className="font-bold text-white">
          {item.actor_name}
        </span>{" "}
        <span className="text-gray-400">{text}</span>{" "}
        <span className="text-gray-500">{formatRelative(item.created_at)}</span>
      </div>
    </li>
  );
}