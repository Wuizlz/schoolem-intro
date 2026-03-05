import { Link } from "react-router-dom";

import Button from "./Button";

export default function NotFound() {
  return (
    <div className="flex h-lvh w-full items-center justify-center ">
      <div className="h-80 w-100 flex items-center flex-col rounded-3xl border border-amber-500/30 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950  shadow-[0_15px_40px_-25px_rgb(245_158_11)]">
        <div className="flex flex-col h-full text-amber-50 items-center justify-center">
          <h1 className=" font-extrabold text-xl">404 not found!</h1>

          <img
            src="/sadschoolem3.png"
            className=" h-32 w-32 max-w-full object-contain"
          ></img>
          <Button
            type="modalButtonAlternative"
            className=" text-sm font-semibold text-yellow-400 hover:text-yellow-300 
                hover:underline  "
            to="/uni"
          >
            Back to Uni
          </Button>
        </div>
      </div>
    </div>
  );
}
