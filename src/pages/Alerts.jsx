import { useNotifications } from "../hooks/useNotifications";
import Spinner from "../ui/ui components/Spinner";
import { formatRelative } from "../utils/helpers";

function AlertItem({ item }) {
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

export default function Alerts() {
  const { notifications, isLoading } = useNotifications();

  if (isLoading) return <div className="h-full w-[24rem] border-r border-gray-800 bg-black p-6 flex justify-center items-center"><Spinner /></div>;

  // Categorize notifications
  const now = Date.now();
  const recent = [];
  const today = [];
  const earlier = [];

  notifications?.forEach(n => {
    const time = new Date(n.created_at).getTime();
    const diffHours = (now - time) / (1000 * 60 * 60);

    if (diffHours < 1) {
      recent.push(n);
    } else if (diffHours < 24) {
      today.push(n);
    } else {
      earlier.push(n);
    }
  });

  return (
    <div className="h-full w-[24rem] overflow-y-auto border-r border-gray-800 bg-black p-6 text-amber-50">
      <h2 className="mb-8 text-2xl font-bold">Alerts</h2>

      {recent.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold">Recent</h3>
          <ul>
            {recent.map((item) => (
              <AlertItem key={item.notification_id} item={item} />
            ))}
          </ul>
        </div>
      )}

      {today.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold">Today</h3>
          <ul>
            {today.map((item) => (
              <AlertItem key={item.notification_id} item={item} />
            ))}
          </ul>
        </div>
      )}

      {earlier.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold">Earlier</h3>
          <ul>
            {earlier.map((item) => (
              <AlertItem key={item.notification_id} item={item} />
            ))}
          </ul>
        </div>
      )}
      
      {(!notifications || notifications.length === 0) && (
          <p className="text-gray-500">No notifications yet.</p>
      )}
    </div>
  );
}