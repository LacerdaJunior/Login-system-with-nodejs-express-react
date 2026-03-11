import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus, Flame, Menu, X } from "lucide-react";

export function AnchorHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="w-full py-4 px-8 flex justify-between items-center border-zinc-800 relative z-50 bg-white">
      <div className="flex items-center gap-1">
        <div>
          <Flame className="text-brand fill-brand" />
        </div>
        <Link to="/">
          <span className="font-bold">LoginSystem</span>
        </Link>
      </div>

      <button
        className="md:hidden text-black focus:outline-none"
        onClick={toggleMenu}
      >
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Menu Mobile (Dropdown) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-white border-b border-zinc-200 flex flex-col p-6 gap-6 md:hidden overflow-hidden shadow-lg"
          >
            <Link
              to="/login"
              onClick={toggleMenu}
              className="flex items-center gap-2 text-black font-medium font-space text-lg"
            >
              <LogIn size={20} />
              Entrar
            </Link>

            <Link to="/register" onClick={toggleMenu}>
              <button className="w-full flex items-center justify-center gap-2 text-black px-5 py-3 rounded-lg font-medium font-space border-2 border-black">
                <UserPlus size={20} />
                Começar Agora
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
