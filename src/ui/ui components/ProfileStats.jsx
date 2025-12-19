export default function ProfileStats({isLoading, data})
{
    return(
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6  text-amber-50 ">
              <div className="flex items-baseline lg:gap-2 gap-1">
                <span className="lg:text-3xl md:text-xl text-sm font-extrabold">
                  {isLoading ? "…" : data?.publicationsCount ?? ""}
                </span>
                <span className="text-xs uppercase tracking-wide text-amber-200/80 mr-1">
                  {data?.publicationsCount === 1 ? "Publication" : "Publications"}
                </span>
              </div>
              <div>
                <div className="flex items-baseline lg:gap-2 gap-1">
                  <span className="lg:text-3xl md:text-xl text-sm font-extrabold">
                    {data?.followersCount}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-amber-200/80">
                    {data?.followersCount === 1 ? "follower" : "followers"}
                  </span>
                </div>
              </div>
              <div className="flex items-baseline lg:gap-2 gap-1">
                <span className="lg:text-3xl md:text-xl text-sm font-extrabold">{data?.followingCount ?? ""}</span>
                <span className="text-xs uppercase tracking-wide text-amber-200/80">
                  Following
                </span>
              </div>
            </div>
    )
}