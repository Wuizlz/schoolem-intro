import OwnUserStory from "../ui/OwnUserCircle";
import UniFeed from "../ui/UniFeed";

export default function Uni() {
  return (
    <div className="flex gap-6 pl-20 pr-24">
      <section className="flex flex-[4] flex-col gap-6 py-5">
        <div className="flex gap-4 overflow-x-auto">
          <OwnUserStory/>
           <span className="h-20 w-px bg-zinc-700 self-center" aria-hidden />
          {/* map over other stories here */}
        </div>

        <div className="flex flex-col pl-20 pr-50 ">
         <UniFeed/>
       
        </div>
      </section>

      <aside className="hidden lg:flex lg:flex-[1] lg:max-w-xs">
        <div className="sticky top-10 w-full rounded-3xl borderp-6 text-center text-zinc-200">
          Coming soon
        </div>
      </aside>
    </div>
  );
}
