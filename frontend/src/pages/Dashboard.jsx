import { useEffect, useState } from "react";
import { AnchorHome } from "../components/AnchorHome";
import { Footer } from "../components/footer";
import { motion } from "framer-motion";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("@LoginOne:user");

    if (userString) {
      const user = JSON.parse(userString);

      const primeiroNome = user.name.split(" ")[0];
      setUserName(primeiroNome);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("@LoginOne:token");
    localStorage.removeItem("@LoginOne:user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-space">
      <AnchorHome />

      <main className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white w-full max-w-md p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center gap-6"
        >
          <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-2">
            <User size={48} />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter text-zinc-800">
              Olá,{" "}
              <span className="text-purple-600">{userName || "Visitante"}</span>
              !
            </h1>
            <p className="text-zinc-500">
              Que bom ver você por aqui. Seu painel está pronto para uso.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 flex items-center gap-2 px-6 py-3 bg-zinc-50 hover:bg-purple-50 text-zinc-600 hover:text-purple-600 font-bold rounded-xl transition-all w-full justify-center"
          >
            <LogOut size={20} />
            Sair da conta
          </button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
