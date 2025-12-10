import { useNotifications } from "../hooks/useNotifications";
import AlertItem from "../ui/AlertItem";
import Spinner from "../ui/ui components/Spinner";

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