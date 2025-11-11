import { useAuth } from "../hooks/useAuth";
import useUniReciever from "../hooks/useUniReciever"

import { SkeletonLine } from "./SkeletonLine";

export default function UniHolder() {
  const { profile, isLoading: authLoading } = useAuth();
  const uniId = profile?.uni_id;
  const { uni, isPending, error } = useUniReciever(uniId);

  const isInitialLoading = (authLoading || isPending) && !uni?.name;

  if (isInitialLoading) {
    return (
      <div className="flex items-center gap-3">
        <SkeletonLine className="h-4 w-32 mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <h3 className="mx-auto text-amber-200 font-serif-display">
          Error loading university
        </h3>
      </div>
    );
  }

  return (
    <div className="flex">
      <h3 className="mx-auto text-amber-200 font-serif-display">
        {uni?.name }
      </h3>
    </div>
  );
}
