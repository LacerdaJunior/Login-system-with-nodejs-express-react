import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  CheckCircle,
  Flame,
  AtSign,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Footer } from "../components/FooterTemp";
import { BackHome } from "../components/BackHome";
import { api } from "../services/api";
import toast from "react-hot-toast";

const AVATARES = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
  "/avatars/avatar7.png",
  "/avatars/avatar8.png",
  "/avatars/avatar9.png",
];

export function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    username: "",
    avatar_url: "/avatars/avatar1.png",
  });

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState("idle");

  const navigate = useNavigate();

  useEffect(() => {
    const userLogado = localStorage.getItem("@LoginOne:user");
    if (userLogado) navigate("/dashboard");
  }, [navigate]);

  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username.length < 3) {
        setUsernameStatus("idle");
        return;
      }
      setUsernameStatus("checking");
      try {
        const response = await api.get(
          `/users/check-username?username=${formData.username}`
        );
        setUsernameStatus(response.data.available ? "available" : "taken");
      } catch (error) {
        setUsernameStatus("idle");
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || formData.password.length < 6) {
      setErro(
        "Preencha todos os campos corretamente (Senha mín. 6 caracteres)."
      );
      return;
    }
    setErro("");
    setStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (usernameStatus === "taken") {
      setErro("Este username já está em uso!");
      return;
    }

    setErro("");
    setCarregando(true);

    try {
      await api.post("/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        username: formData.username,
        avatar_url: formData.avatar_url,
      });

      toast.success("Conta criada com sucesso! Faça seu login.");
      navigate("/login");
    } catch (error) {
      setErro(error.response?.data?.error || "Erro ao criar a conta.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-space flex flex-col overflow-x-hidden">
      <BackHome />

      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-8 pb-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center gap-2">
            <Flame size={40} className="text-brand fill-brand" />
            <h2 className="text-3xl font-bold tracking-tighter text-center">
              {step === 1 ? "Criar conta" : "Sua Identidade"}
            </h2>
            <p className="text-zinc-500 text-center">
              {step === 1
                ? "Passo 1 de 2: Dados Básicos"
                : "Passo 2 de 2: Escolha seu @ e Avatar"}
            </p>
          </div>

          {erro && (
            <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center border border-red-200">
              {erro}
            </div>
          )}

          <div className="w-full">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleNextStep}
                  className="space-y-4 w-full"
                >
                  <div className="relative">
                    <User
                      className="absolute left-3 top-3.5 text-zinc-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Nome completo"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="w-full pl-10 pr-4 py-3 border-2 border-zinc-100 rounded-xl focus:border-brand outline-none transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-3.5 text-zinc-400"
                      size={20}
                    />
                    <input
                      type="email"
                      placeholder="E-mail"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="w-full pl-10 pr-4 py-3 border-2 border-zinc-100 rounded-xl focus:border-brand outline-none transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-3.5 text-zinc-400"
                      size={20}
                    />
                    <input
                      type="password"
                      placeholder="Crie uma senha"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-3 border-2 border-zinc-100 rounded-xl focus:border-brand outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
                  >
                    Próximo Passo <ArrowRight size={20} />
                  </button>

                  <p className="text-center text-zinc-600 mt-4 block">
                    Já possui conta?{" "}
                    <Link
                      to="/login"
                      className="text-brand font-bold hover:underline"
                    >
                      Faça login
                    </Link>
                  </p>
                </motion.form>
              ) : (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleRegister}
                  className="space-y-6 w-full"
                >
                  <div className="relative">
                    <label className="text-sm font-bold text-zinc-700 mb-1 block">
                      Nome de Usuário Único
                    </label>
                    <div className="relative">
                      <AtSign
                        className="absolute left-3 top-3.5 text-zinc-400"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="lacerdazjr"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            username: e.target.value
                              .toLowerCase()
                              .replace(/\s/g, ""),
                          })
                        }
                        required
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
                          usernameStatus === "taken"
                            ? "border-red-500 focus:border-red-500"
                            : usernameStatus === "available"
                            ? "border-green-500 focus:border-green-500"
                            : "border-zinc-100 focus:border-brand"
                        }`}
                      />
                    </div>
                    {usernameStatus === "taken" && (
                      <p className="text-xs text-red-500 mt-1 font-bold">
                        @ indisponível ou já em uso
                      </p>
                    )}
                    {usernameStatus === "available" && (
                      <p className="text-xs text-green-500 mt-1 font-bold">
                        @ disponível!
                      </p>
                    )}
                    {usernameStatus === "checking" && (
                      <p className="text-xs text-zinc-400 mt-1">
                        Verificando...
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-bold text-zinc-700 mb-2 block text-center">
                      Escolha seu Avatar
                    </label>
                    <div className="grid grid-cols-3 gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-100 max-h-[40vh] sm:max-h-full overflow-y-auto custom-scrollbar">
                      {AVATARES.map((caminho) => (
                        <button
                          key={caminho}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, avatar_url: caminho })
                          }
                          className={`relative p-2 rounded-xl border-2 transition-all hover:scale-105 h-20 overflow-hidden ${
                            formData.avatar_url === caminho
                              ? "border-brand bg-brand/10 ring-2 ring-brand ring-offset-2"
                              : "bg-white border-zinc-200"
                          }`}
                        >
                          <img
                            src={caminho}
                            alt="Avatar"
                            className="w-full h-full object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-4 bg-zinc-100 text-zinc-600 rounded-xl font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button
                      type="submit"
                      disabled={carregando || usernameStatus === "taken"}
                      className="flex-1 bg-brand text-white py-4 rounded-xl font-bold text-lg hover:bg-[#4F46E5] transition-all shadow-lg shadow-brand/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {carregando ? (
                        "Criando..."
                      ) : (
                        <>
                          <CheckCircle size={20} /> Finalizar
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
