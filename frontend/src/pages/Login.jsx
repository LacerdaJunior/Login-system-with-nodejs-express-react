import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Flame } from "lucide-react";
import { Footer } from "../components/Footer";
import { BackHome } from "../components/BackHome";
import { api } from "../services/api";
import { useEffect } from "react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userLogado = localStorage.getItem("@LoginOne:user");

    if (userLogado) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("@LoginOne:token", token);
      localStorage.setItem("@LoginOne:user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);

      setErro(
        error.response?.data?.error ||
          "Email ou senha incorretos. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-space flex flex-col">
      <BackHome />

      <main className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="flex flex-col items-center gap-2">
            <Flame size={40} className="text-brand fill-brand" />
            <h2 className="text-3xl font-bold tracking-tighter">
              Bem-vindo de volta
            </h2>
            <p className="text-zinc-500">
              Insira seus dados para acessar sua conta
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {erro && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center border border-red-200">
                {erro}
              </div>
            )}

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
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-zinc-100 rounded-xl focus:border-brand outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-brand text-white py-4 rounded-xl font-bold text-lg hover:bg-[#4F46E5] transition-all shadow-lg shadow-brand/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {carregando ? (
                "Entrando..."
              ) : (
                <>
                  Entrar <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-zinc-600">
            Não tem uma conta?{" "}
            <Link
              to="/register"
              className="text-brand font-bold hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
