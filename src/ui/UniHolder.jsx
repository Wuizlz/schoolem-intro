import useUniReciever from "../hooks/useUniReciever"
import { useAuth } from "../hooks/useAuth";

export default function UniHolder() {
  const { profile, isLoading: authLoading } = useAuth();
  const uniId = profile?.uni_id;
  const { uni, isPending, error } = useUniReciever(uniId);

  let content = "Loading";
  if (uni?.name) content = uni.name;
  else if (error) content = "Error loading university";
  else if (authLoading || isPending) content = "Loading…";

  return (
    <div className="flex">
      <h3 className="mx-auto text-amber-200 font-serif-display">
        {content}
      </h3>
    </div>
  );
}
