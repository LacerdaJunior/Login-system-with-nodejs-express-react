import { Flame, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-100 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Flame size={20} className="text-brand fill-brand" />
          <span className="font-space font-bold text-black">TaskSystem</span>
          <span className="text-zinc-400 ml-2 text-sm">
            | © 2026 Guilherme Lacerda
          </span>
        </div>

        <div className="flex items-center gap-5">
          <a
            href="https://github.com/LacerdaJunior"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-brand transition-colors"
          >
            <Github size={22} />
          </a>
          <a
            href="https://www.linkedin.com/in/guilherme-lacerda49"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-brand transition-colors"
          >
            <Linkedin size={22} />
          </a>
        </div>
      </div>
    </footer>
  );
}
