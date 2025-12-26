import OwnUserCircle from "../ui/ui components/OwnUserCircle";

import UniFeed from "../ui/UniFeed";

export default function Uni() {
  return (
    <div className=" gap-6 sm:flex  sm:justify-center ">
      <section className="  sm:w-full sm:max-w-150 flex flex-col gap-6 py-5 ">
        <div className="flex gap-4 overflow-x-auto pl-2 py-2">
          <OwnUserCircle type="uniStyle"/>
          
          {/* map over other stories here */}
        </div>

        <div className="flex flex-col ">
         <UniFeed/>
       
        </div>
      </section>

      <aside className="hidden  min-[1240px]:flex flex-none shrink-0 w-64">
        <div className="sticky top-10 w-full rounded-3xl borderp-6 text-center text-zinc-200">
          Coming soon
        </div>
      </aside>
    </div>
  );
}
