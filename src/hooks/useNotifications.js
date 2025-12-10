import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../services/apiAlerts";
import { useAuth } from "./useAuth";

export function useNotifications() {
  const { user } = useAuth();
  
  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => getNotifications(user.id),
    enabled: !!user?.id,
  });

  return { notifications, isLoading, error };
}
