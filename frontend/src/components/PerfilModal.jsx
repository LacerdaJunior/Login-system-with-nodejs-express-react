import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  X,
  Edit2,
  Settings,
  Lock,
  Trash2,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

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

export function ProfileModal({ onClose }) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userUsername, setUserUsername] = useState(""); 
  const [avatarUrl, setAvatarUrl] = useState(null);

  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [newName, setNewName] = useState("");
  const [passwords, setPasswords] = useState({
    atual: "",
    nova: "",
    confirmacao: "",
  });
  const [deletePassword, setDeletePassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("@LoginOne:user");
    if (userString) {
      const user = JSON.parse(userString);
      setUserName(user.name);
      setNewName(user.name);
      setUserEmail(user.email);
      setUserUsername(user.username); 
      if (user.avatar_url) setAvatarUrl(user.avatar_url);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("@LoginOne:token");
    localStorage.removeItem("@LoginOne:user");
    window.dispatchEvent(new Event("usuarioAtualizado"));
    navigate("/login");
  };

  const handleSalvarNome = async () => {
    try {
      await api.patch("/dashboard/profile/name", {
        newUsername: newName,
      });

      setUserName(newName);
      setIsEditingName(false);

      const userString = localStorage.getItem("@LoginOne:user");
      if (userString) {
        const userObj = JSON.parse(userString);
        userObj.name = newName;
        localStorage.setItem("@LoginOne:user", JSON.stringify(userObj));
        window.dispatchEvent(new Event("usuarioAtualizado"));
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar o nome.");
    }
  };

  const handleEscolherAvatar = async (caminhoDoAvatar) => {
    try {
      await api.patch("/dashboard/profile", {
        avatar_url: caminhoDoAvatar,
      });

      setAvatarUrl(caminhoDoAvatar);
      setIsEditingAvatar(false);

      const userString = localStorage.getItem("@LoginOne:user");
      if (userString) {
        const userObj = JSON.parse(userString);
        userObj.avatar_url = caminhoDoAvatar;
        localStorage.setItem("@LoginOne:user", JSON.stringify(userObj));
        window.dispatchEvent(new Event("usuarioAtualizado"));
      }
    } catch (error) {
      console.error("Erro ao atualizar avatar no banco:", error);
      alert("Não foi possível salvar seu avatar no banco de dados.");
    }
  };

  const handleMudarSenha = async (e) => {
    e.preventDefault();
    if (passwords.nova !== passwords.confirmacao) {
      return alert("As senhas novas não coincidem!");
    }

    try {
      await api.patch("/dashboard/profile/updatepass", {
        oldPassword: passwords.atual,
        newPassword: passwords.nova,
      });

      alert("Senha alterada com sucesso!");
      setPasswords({ atual: "", nova: "", confirmacao: "" });
      setShowAdvanced(false);
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao alterar a senha.");
    }
  };

  const handleExcluirConta = async (e) => {
    e.preventDefault();
    if (!deletePassword) return alert("Digite sua senha para confirmar!");
    const confirmacao = window.confirm(
      "TEM CERTEZA? Essa ação não pode ser desfeita."
    );

    if (confirmacao) {
      try {
        await api.delete("/dashboard/profile/deleteacc", {
          data: { password: deletePassword },
        });
        alert("Sua conta foi excluída com sucesso.");
        handleLogout();
      } catch (error) {
        alert(error.response?.data?.error || "Erro ao excluir conta.");
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"></div>
      <main className="fixed inset-0 flex items-center justify-center px-4 py-6 z-[60] ">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          /* Ajuste de responsividade aqui: p-6 em mobile e p-8 em desktop */
          className="relative bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl shadow-2xl flex flex-col gap-6 custom-scrollbar"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center gap-4 mt-4">
            <div className="relative">
              <div
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden flex items-center justify-center shadow-md border-4 ${
                  avatarUrl ? "border-brand" : "bg-zinc-50 border-zinc-200"
                }`}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Seu avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-zinc-400" />
                )}
              </div>
              <button
                onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                className="absolute bottom-0 right-0 p-2.5 sm:p-3 bg-brand text-white rounded-full shadow-lg hover:opacity-90 transition-opacity border-2 border-white"
                title="Trocar Avatar"
              >
                <Edit2 size={16} />
              </button>
            </div>

            <div className="flex flex-col items-center w-full">
              {isEditingName ? (
                <div className="flex items-center gap-2 w-full max-w-xs">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 px-4 py-2 border-2 border-brand rounded-lg outline-none font-semibold text-center focus:ring-2 focus:ring-brand/20"
                    autoFocus
                  />
                  <button
                    onClick={handleSalvarNome}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-sm"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="p-2 bg-zinc-200 text-zinc-600 rounded-lg hover:bg-zinc-300 shadow-sm"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center gap-2">
                    <h1 className="text-2xl font-bold text-zinc-800">
                      {userName}
                    </h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-zinc-400 hover:text-brand transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>
                  <p className="text-zinc-500 mt-1 font-medium text-sm">
                    {userEmail}
                  </p>
                  {/* EXIBIÇÃO DO @USERNAME AQUI */}
                  <p className="text-brand text-sm font-bold mt-0.5">
                    @{userUsername}
                  </p>
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {isEditingAvatar && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-zinc-50 p-4 sm:p-6 rounded-2xl border border-zinc-100">
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 text-center">
                    Selecione um novo avatar
                  </h3>
                  {/* SCROLL ADICIONADO AQUI: max-h-[200px] e overflow-y-auto */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 max-h-[200px] overflow-y-auto custom-scrollbar p-1">
                    {AVATARES.map((caminho) => (
                      <button
                        key={caminho}
                        onClick={() => handleEscolherAvatar(caminho)}
                        className={`relative p-2 rounded-xl border-2 transition-all hover:scale-105 h-16 sm:h-20 overflow-hidden ${
                          avatarUrl === caminho
                            ? "border-brand bg-brand/10"
                            : "bg-white border-zinc-200 hover:border-brand/50"
                        }`}
                      >
                        <img
                          src={caminho}
                          alt="Opção"
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full h-px bg-zinc-100" />

          <div className="w-full">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full p-4 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors text-zinc-700 font-semibold"
            >
              <div className="flex items-center gap-3">
                <Settings
                  size={20}
                  className={showAdvanced ? "text-brand" : "text-zinc-400"}
                />
                Configurações Avançadas
              </div>
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 flex flex-col gap-4 sm:gap-6 p-1">
                    <form
                      onSubmit={handleMudarSenha}
                      className="bg-white border border-zinc-200 p-4 sm:p-5 rounded-xl flex flex-col gap-3"
                    >
                      <h4 className="font-bold text-zinc-800 flex items-center gap-2 mb-2">
                        <Lock size={16} className="text-brand" /> Alterar Senha
                      </h4>
                      <input
                        type="password"
                        placeholder="Senha Atual"
                        required
                        value={passwords.atual}
                        onChange={(e) =>
                          setPasswords({ ...passwords, atual: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-brand"
                      />
                      <input
                        type="password"
                        placeholder="Nova Senha"
                        required
                        value={passwords.nova}
                        onChange={(e) =>
                          setPasswords({ ...passwords, nova: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-brand"
                      />
                      <input
                        type="password"
                        placeholder="Confirmar Nova Senha"
                        required
                        value={passwords.confirmacao}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            confirmacao: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-brand"
                      />
                      <button
                        type="submit"
                        className="mt-2 w-full bg-brand text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Atualizar Senha
                      </button>
                    </form>

                    <form
                      onSubmit={handleExcluirConta}
                      className="bg-red-50 border border-red-200 p-4 sm:p-5 rounded-xl flex flex-col gap-3"
                    >
                      <h4 className="font-bold text-red-600 flex items-center gap-2 mb-2">
                        <Trash2 size={16} /> Excluir conta
                      </h4>
                      <p className="text-xs sm:text-sm text-red-600/80 mb-2 font-space">
                        Para excluir sua conta permanentemente, digite sua senha
                        atual para confirmar.
                      </p>
                      <input
                        type="password"
                        placeholder="Sua senha para confirmar"
                        required
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-red-200 rounded-lg outline-none focus:border-red-500"
                      />
                      <button
                        type="submit"
                        className="mt-2 w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Excluir Minha Conta
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-4 bg-zinc-50 hover:bg-zinc-100 text-red-500 font-bold rounded-xl transition-all w-full justify-center mt-auto border border-zinc-200"
          >
            <LogOut size={20} /> Sair da conta
          </button>
        </motion.div>
      </main>
    </>
  );
}
