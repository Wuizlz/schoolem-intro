import { formatRelative } from "../hooks/useFormatRelative";

export default function UserComment({ data }) {
  const avatar = data?.author?.avatar_url;
  const name = data?.author?.display_name ?? "User";
  const body = data?.body ?? "";
  const createdAt = data?.created_at;

  return (
    <li className="w-full">
      <div className="flex gap-3">
        <div className="shrink-0 h-11 w-11 rounded-full border border-[var(--color-grey-200)] p-[2px] bg-[var(--color-grey-50)]">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="h-full w-full rounded-full bg-[var(--color-grey-100)]" />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <p className="leading-snug text-md break-words text-[var(--color-grey-900)]">
            <span className="font-extrabold mr-1 text-[var(--color-grey-900)]">
              {name}
            </span>
            <span className="font-light text-[var(--color-grey-700)]">
              {body}
            </span>
          </p>

          <p className="mt-1 text-xs font-light text-[var(--color-grey-500)]">
            {formatRelative(createdAt)}
          </p>
        </div>
      </div>
    </li>
  );
}