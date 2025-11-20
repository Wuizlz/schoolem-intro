import { useAuth } from "../hooks/useAuth";
import { SkeletonLine } from "./SkeletonLine";

export default function UniHolder() {
  const { profile, isLoading: authLoading, error } = useAuth();

  const uni = profile?.universities?.name;

  const isInitialLoading = authLoading && !uni;

  if (isInitialLoading) {
    return (
      <div className="flex items-center gap-3">
        <SkeletonLine className="h-10 w-32 mx-auto" />
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
      <h3 className="mx-auto text-amber-200 font-serif-display">{uni}</h3>
    </div>
  );
}
