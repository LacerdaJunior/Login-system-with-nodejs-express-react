import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, CheckCircle, Flame } from "lucide-react";
import { Footer } from "../components/footer";
import { Header } from "../components/Header";
import { AnchorHome } from "../components/AnchorHome";
import { api } from "../services/api";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await api.post("/register", {
        name,
        email,
        password,
      });

      console.log("Conta criada com sucesso!");

      navigate("/login");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setErro(
        error.response?.data?.error ||
          "Erro ao criar a conta. Email informado já está em uso."
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-space flex flex-col">
      <AnchorHome />

      <main className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="flex flex-col items-center gap-2">
            <Flame size={40} className="text-brand fill-brand" />
            <h2 className="text-3xl font-bold tracking-tighter">Criar conta</h2>
            <p className="text-zinc-500">Comece sua jornada hoje</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {erro && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center border border-red-200">
                {erro}
              </div>
            )}

            <div className="relative">
              <User className="absolute left-3 top-3 text-zinc-400" size={20} />
              <input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-zinc-100 rounded-xl focus:border-brand outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-zinc-400" size={20} />
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-zinc-100 rounded-xl focus:border-brand outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-zinc-400" size={20} />
              <input
                type="password"
                placeholder="Crie uma senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 border-2 border-zinc-100 rounded-xl focus:border-brand outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-brand text-white py-4 rounded-xl font-bold text-lg hover:bg-[#4F46E5] transition-all shadow-lg shadow-brand/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {carregando ? (
                "Criando conta..."
              ) : (
                <>
                  Criar conta grátis <CheckCircle size={20} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-zinc-600">
            Já possui conta?{" "}
            <Link to="/login" className="text-brand font-bold hover:underline">
              Faça login
            </Link>
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
