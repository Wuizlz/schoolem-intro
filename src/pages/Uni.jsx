import OwnUserCircle from "../ui/ui components/OwnUserCircle";

import UniFeed from "../ui/UniFeed";

export default function Uni() {
  return (
    <div className="flex gap-6 sm:pl-5 sm:pr-9 md:pl-10 md:pr-14 lg:pl-20 lg:pr-24">
      <section className="flex flex-[4] flex-col gap-6 py-5">
        <div className="flex gap-4 overflow-x-auto">
          <OwnUserCircle type="uniStyle"/>
          
          {/* map over other stories here */}
        </div>

        <div className="flex flex-col md:pl-10 md:pr-10 lg:pl-20 lg:pr-20 ">
         <UniFeed/>
       
        </div>
      </section>

      <aside className="hidden lg:flex-[1] min-[1240px]:flex">
        <div className="sticky top-10 w-full rounded-3xl borderp-6 text-center text-zinc-200">
          Coming soon
        </div>
      </aside>
    </div>
  );
}
