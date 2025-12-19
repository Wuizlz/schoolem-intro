import { formatRelative } from "../hooks/useFormatRelative";

export default function UserComment({ data }) {
  console.log(data);
  return (
    <li>
      <div className="flex flex-row ">
        <div className="flex shrink-0 h-11 w-11 rounded-full border  p-[3px]   ">
          <img
            src={data?.author?.avatar_url}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <main className="flex flex-col">
          <div className="flex flex-col break-words  ">
            <p className="leading-snug text-md">
              <span className="text-amber-50 font-extrabold mr-1">
                {data?.author?.display_name}
              </span>
              <span className="text-amber-50 font-extralight">
                {data?.body}
              </span>
            </p>
            </div>

          <div className="flex flex-row">
            <p className="font-thin text-xs text-gray-400">{formatRelative(data?.created_at)}</p>
          </div>
        </main>
      </div>

      {/* <p className="font-thin text-xs text-gray-400">
              {formatRelative(data?.created_at)}
            </p> */}
    </li>
  );
}
