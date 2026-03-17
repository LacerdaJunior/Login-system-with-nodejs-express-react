import { Link } from "react-router-dom";
import { Flame, ArrowLeft } from "lucide-react";

export function BackHome() {
  return (
    <header className="w-full py-4 px-8 flex justify-between items-center border-b border-zinc-100 bg-white relative z-40">
      <div>
        <Link to="/">
          <div className="flex items-center gap-1">
            <Flame className="text-brand fill-brand" />
            <span className="font-bold text-xl text-zinc-800 font-space tracking-wide">
              LoginSystem
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
