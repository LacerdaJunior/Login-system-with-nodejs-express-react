import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import { UserMenu } from "./UserMenu";

export function AnchorHome() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const carregarUsuario = () => {
      const userString = localStorage.getItem("@LoginOne:user");
      if (userString) {
        setUser(JSON.parse(userString));
      }
    };

    carregarUsuario();
    window.addEventListener("usuarioAtualizado", carregarUsuario);
    window.addEventListener("storage", carregarUsuario);

    return () => {
      window.removeEventListener("usuarioAtualizado", carregarUsuario);
      window.removeEventListener("storage", carregarUsuario);
    };
  }, []);

  if (!user) return null;

  return (
    <header className="w-full py-4 px-8 flex justify-between items-center border-b border-zinc-100 bg-white relative z-40">
      <div className="flex items-center gap-1">
        <Flame className="text-brand fill-brand" />
        <Link to="/">
          <span className="font-bold text-xl text-zinc-800">LoginSystem</span>
        </Link>
      </div>

      <div className="flex items-center gap-4 text-black">
        <UserMenu user={user} />
      </div>
    </header>
  );
}
