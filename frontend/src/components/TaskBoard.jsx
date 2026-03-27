import { useState, useEffect } from "react";
import { api } from "../services/api";
import { NewTaskModal } from "./NewTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { CategoriesManager } from "./CategoriesManager";
import toast, { Toaster } from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Plus,
  Calendar,
  MoreVertical,
  CheckCircle2,
  Circle,
  AlertCircle,
  Trash2,
  Edit2,
  UserPlus,
  GripVertical,
  Pin,
  Tag,
  ChevronDown,
  ChevronRight,
  Search,
  BarChart3,
  UserMinus,
  ListTodo,
} from "lucide-react";

const formatarData = (dataString) => {
  if (!dataString) return "Sem data";
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};


const TaskCard = ({ task, onEdit, dragHandleProps, onRefresh }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("@LoginOne:user") || "{}");

  const isAssignee = task.assignee && task.assignee.id === user.id;
  const isOwner = task.owner_id === user.id;

  const handleDelete = async () => {
    setIsMenuOpen(false);
    toast(
      (t) => (
        <div className="flex flex-col gap-3 min-w-[200px] font-space">
          <span className="font-semibold text-sm text-zinc-800 text-center">
            Excluir permanentemente?
          </span>
          <div className="flex justify-center gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const loadingToast = toast.loading("Excluindo...");
                try {
                  await api.delete(`/dashboard/tasks/${task.id}`);
                  toast.success("Tarefa excluída!", { id: loadingToast });
                  onRefresh(); 
                } catch (error) {
                  toast.error("Erro ao excluir.", { id: loadingToast });
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold w-full"
            >
              Excluir
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-xs font-bold w-full"
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  const progress = task.progressInfo?.progress || 0;
  const totalSubs = task.progressInfo?.totalChecklist || 0;
  const completedSubs = task.progressInfo?.completed || 0;

  return (
    <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 group relative font-space">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div
            {...dragHandleProps}
            className="text-zinc-400 hover:text-brand cursor-grab active:cursor-grabbing p-1 -ml-2 rounded"
          >
            <GripVertical size={16} />
          </div>
          {task.category ? (
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${task.category.color}20`,
                color: task.category.color,
              }}
            >
              {task.category.name}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-500">
              Sem categoria
            </span>
          )}
        </div>

        {isOwner && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="text-zinc-300 hover:text-zinc-600 p-1 rounded-md hover:bg-zinc-100 relative z-20"
          >
            <MoreVertical size={16} />
          </button>
        )}

        {isMenuOpen && isOwner && (
          <div className="absolute top-10 right-4 w-40 bg-white border border-zinc-200 rounded-lg shadow-xl z-30 overflow-hidden flex flex-col">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
            >
              <Trash2 size={14} /> Excluir
            </button>
          </div>
        )}
      </div>

      <div className="cursor-pointer" onClick={() => onEdit(task)}>
        <h4 className="font-bold text-zinc-800 text-sm mb-1 hover:text-brand transition-colors">
          {task.title}
        </h4>

        {totalSubs > 0 && (
          <div className="mt-2 mb-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1">
                <ListTodo size={10} /> {completedSubs}/{totalSubs}
              </span>
              <span className="text-[10px] font-bold text-brand">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-1.5">
              <div
                className="bg-brand h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-zinc-50">
        <div
          className={`flex items-center gap-1.5 text-xs font-medium ${
            task.status === "DONE" ? "text-green-500" : "text-zinc-400"
          }`}
        >
          {task.status === "DONE" ? (
            <CheckCircle2 size={14} />
          ) : (
            <Calendar size={14} />
          )}
          <span>{formatarData(task.due_date)}</span>
        </div>
        <div className="flex items-center gap-1">
          {task.assignee ? (
            <div
              className="flex items-center gap-2"
              title={`Responsável: ${task.assignee.name}`}
            >
              <img
                src={task.assignee.avatar_url}
                alt="Assignee"
                className="w-6 h-6 rounded-full border border-zinc-200 object-cover shadow-sm"
              />
              {isAssignee && (
                <span className="text-[10px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                  Para Mim
                </span>
              )}
            </div>
          ) : (
            <div
              className="w-6 h-6 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[10px] font-bold shadow-sm"
              title="Você é o dono"
            >
              VC
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const NetworkTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const fetchNetworkData = async () => {
    try {
      const [friendsRes, pendingRes] = await Promise.all([
        api.get("/friends"),
        api.get("/friends/pending"),
      ]);
      setFriends(friendsRes.data);
      setPendingRequests(pendingRes.data);
    } catch (error) {
      console.error("Erro ao carregar rede:", error);
    }
  };
  useEffect(() => {
    fetchNetworkData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      const response = await api.get(`/users/search?username=${searchQuery}`);
      setSearchResult(response.data);
    } catch (error) {
      toast.error("Usuário não encontrado.");
      setSearchResult(null);
    }
  };

  const handleSendInvite = async (receiverId) => {
    try {
      await api.post("/friends/request", { receiverId });
      toast.success("Convite enviado com sucesso!");
      setSearchResult(null);
      setSearchQuery("");
      fetchNetworkData();
    } catch (error) {
      toast.error("Erro ao enviar convite.");
    }
  };

  const handleAcceptInvite = async (connectionId) => {
    try {
      await api.patch(`/friends/accept/${connectionId}`);
      toast.success("Agora vocês são amigos!");
      fetchNetworkData();
    } catch (error) {
      toast.error("Erro ao aceitar convite.");
    }
  };

  const handleRemoveFriend = async (friendId, friendName) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 font-space">
          <span className="font-semibold text-sm text-zinc-800 text-center">
            Desfazer amizade com {friendName}?
          </span>
          <div className="flex justify-center gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await api.delete(`/friends/${friendId}`);
                  toast.success("Amizade desfeita.");
                  fetchNetworkData();
                } catch (error) {
                  toast.error("Erro ao remover amigo.");
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold w-full transition-colors"
            >
              Remover
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-xs font-bold w-full transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm font-space">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <UserPlus className="text-brand" /> Buscar Conexões
      </h3>
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-zinc-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por @username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-brand outline-none transition-colors"
          />
        </div>
        <button
          type="submit"
          className="bg-zinc-900 text-white px-6 font-bold rounded-xl hover:bg-black transition-colors"
        >
          Buscar
        </button>
      </form>

      {searchResult && (
        <div className="mb-8 p-4 border-2 border-brand/20 bg-brand/5 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={searchResult.avatar_url}
              alt="Avatar"
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
            />
            <div>
              <p className="font-bold text-zinc-800">{searchResult.name}</p>
              <p className="text-sm text-zinc-500">@{searchResult.username}</p>
            </div>
          </div>
          <button
            onClick={() => handleSendInvite(searchResult.id)}
            className="bg-brand text-white px-4 py-2 rounded-lg font-bold hover:opacity-90"
          >
            Adicionar
          </button>
        </div>
      )}

      {pendingRequests.length > 0 && (
        <div className="mb-8">
          <h4 className="font-bold text-brand mb-4 border-b border-brand/20 pb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
            Convites Pendentes ({pendingRequests.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 border border-zinc-200 bg-zinc-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={request.avatar_url}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                  />
                  <div>
                    <p className="font-bold text-sm text-zinc-800">
                      {request.name}
                    </p>
                    <p className="text-xs text-zinc-500">Quer se conectar</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAcceptInvite(request.id)}
                  className="bg-brand text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-90"
                >
                  Aceitar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <h4 className="font-bold text-zinc-700 mb-4 border-b pb-2">
        Minha Rede ({friends.length})
      </h4>
      {friends.length === 0 ? (
        <p className="text-zinc-500 text-sm italic bg-zinc-50 p-4 rounded-xl text-center border border-zinc-100">
          Você ainda não possui conexões. Busque um amigo acima!
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex flex-col items-center gap-2 p-4 border border-zinc-200 rounded-xl hover:shadow-md transition-shadow bg-white text-center relative group"
            >
              <button
                onClick={() => handleRemoveFriend(friend.id, friend.name)}
                className="absolute top-2 right-2 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <UserMinus size={16} />
              </button>
              <img
                src={friend.avatar_url}
                alt="amigo"
                className="w-14 h-14 rounded-full object-cover border-2 border-zinc-100 shadow-sm"
              />
              <p className="font-bold text-sm text-zinc-800 w-full truncate">
                {friend.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const MetricsTab = () => {
  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
  });
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [metricsRes, progressRes] = await Promise.all([
          api.get("/dashboard/metrics"),
          api.get("/dashboard/tasks/progress"),
        ]);
        setMetrics(
          metricsRes.data || {
            totalTasks: 0,
            todoTasks: 0,
            inProgressTasks: 0,
            doneTasks: 0,
          }
        );
        setProgress(progressRes.data || []);
      } catch (error) {
        console.error("Erro ao carregar métricas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading)
    return (
      <p className="text-center text-zinc-500 p-8 animate-pulse">
        Calculando métricas...
      </p>
    );

  const donePercentage =
    metrics.totalTasks > 0
      ? Math.round((metrics.doneTasks / metrics.totalTasks) * 100)
      : 0;

  return (
    <div className="space-y-6 font-space">
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-32 h-32 shrink-0 flex items-center justify-center rounded-full border-8 border-zinc-100">
          <svg
            className="absolute inset-0 w-full h-full transform -rotate-90"
            viewBox="0 0 36 36"
          >
            <path
              strokeDasharray={`${donePercentage}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={donePercentage > 0 ? "#6366F1" : "#e4e4e7"}
              strokeWidth="4"
            />
          </svg>
          <div className="text-center">
            <span className="text-2xl font-black text-brand">
              {donePercentage}%
            </span>
          </div>
        </div>
        <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-zinc-50 rounded-lg">
            <p className="text-zinc-500 text-xs font-bold">Total</p>
            <p className="text-xl font-black text-zinc-800">
              {metrics.totalTasks || 0}
            </p>
          </div>
          <div className="p-3 bg-zinc-50 rounded-lg">
            <p className="text-zinc-500 text-xs font-bold">A Fazer</p>
            <p className="text-xl font-black text-zinc-400">
              {metrics.todoTasks || 0}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-600/80 text-xs font-bold">Andamento</p>
            <p className="text-xl font-black text-blue-600">
              {metrics.inProgressTasks || 0}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-green-600/80 text-xs font-bold">Concluídas</p>
            <p className="text-xl font-black text-green-600">
              {metrics.doneTasks || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-800 mb-4 border-b border-zinc-100 pb-2">
          Progresso das Atividades
        </h3>
        {progress.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">
            Nenhuma tarefa encontrada.
          </p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {progress.map((p) => (
              <div
                key={p.taskId}
                className="bg-zinc-50 p-4 rounded-lg border border-zinc-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-zinc-700">{p.title}</span>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-white border border-zinc-200">
                    {p.completed} / {p.totalChecklist} subs
                  </span>
                </div>
                <div className="w-full bg-zinc-200 rounded-full h-2.5 mb-1 overflow-hidden">
                  <div
                    className="bg-brand h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${p.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-zinc-500 font-bold">
                    {p.progress}% Completo
                  </span>
                  {p.warning && (
                    <span className="text-[10px] text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      {p.warning}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


export function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [collapsed, setCollapsed] = useState({
    TODO: false,
    IN_PROGRESS: false,
    DONE: false,
  });
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [activeTab, setActiveTab] = useState("board");

 
  const fetchAllData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const [tasksRes, catRes, friendsRes, progressRes] = await Promise.all([
        api.get("/dashboard/tasks"),
        api.get("/dashboard/categories"),
        api.get("/friends"),
        api.get("/dashboard/tasks/progress"),
      ]);

      const tasksWithProgress = tasksRes.data.map((task) => {
        const prog = progressRes.data.find((p) => p.taskId === task.id);
        return { ...task, progressInfo: prog || null };
      });

      setTasks(tasksWithProgress);
      setCategories(catRes.data);
      setFriends(friendsRes.data);
    } catch (error) {
      toast.error("Erro ao carregar os dados.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData(true);
  }, []);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId;
    setTasks((prev) =>
      prev.map((t) => (t.id === draggableId ? { ...t, status: newStatus } : t))
    );
    try {
      await api.patch(`/dashboard/tasks/${draggableId}`, { status: newStatus });
      fetchAllData(false); 
    } catch (error) {
      toast.error("Erro ao salvar posição.");
      fetchAllData(false);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => {
      const matchesStatus = task.status === status;
      const matchesCategory =
        selectedFilter === "ALL" ||
        (task.category && task.category.id === selectedFilter);
      return matchesStatus && matchesCategory;
    });
  };

  const toggleCollapse = (status) =>
    setCollapsed((prev) => ({ ...prev, [status]: !prev[status] }));

  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-zinc-50/50">
        <p className="text-zinc-500 font-bold animate-pulse font-space">
          Carregando painel...
        </p>
      </div>
    );

  return (
    <div className="w-full h-full p-4 sm:p-8 bg-zinc-50/50 relative font-space">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800 tracking-tight">
            O Meu Painel
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            Gira os seus projetos, rede e métricas.
          </p>
        </div>
        {activeTab === "board" && (
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-brand cursor-pointer"
            >
              <option value="ALL">Todas as Categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="w-full sm:w-auto bg-brand hover:bg-brand/90 text-white px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Plus size={18} /> Nova Tarefa
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-6 border-b border-zinc-200 mb-8 pb-4 sm:pb-0">
        {[
          { id: "board", icon: <Pin size={16} />, label: "Meu Quadro" },
          { id: "categories", icon: <Tag size={16} />, label: "Categorias" },
          { id: "network", icon: <UserPlus size={16} />, label: "Rede" },
          { id: "metrics", icon: <BarChart3 size={16} />, label: "Métricas" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center gap-2 px-4 py-2 sm:px-0 sm:py-0 sm:pb-3 text-sm font-bold transition-all relative rounded-lg sm:rounded-none w-[calc(50%-6px)] sm:w-auto ${
              activeTab === tab.id
                ? "bg-brand/10 text-brand sm:bg-transparent"
                : "bg-white border border-zinc-200 sm:border-none sm:bg-transparent text-zinc-500 hover:bg-zinc-50"
            }`}
          >
            {tab.icon} {tab.label}
            {activeTab === tab.id && (
              <div className="hidden sm:block absolute bottom-0 left-0 w-full h-0.5 bg-brand rounded-t-full"></div>
            )}
          </button>
        ))}
      </div>

      {activeTab === "categories" && <CategoriesManager />}
      {activeTab === "network" && <NetworkTab />}
      {activeTab === "metrics" && <MetricsTab />}

      {activeTab === "board" && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <Droppable droppableId="TODO">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-col gap-4 min-h-[100px] p-2 rounded-xl transition-colors ${
                    snapshot.isDraggingOver ? "bg-zinc-100" : ""
                  }`}
                >
                  <div
                    onClick={() => toggleCollapse("TODO")}
                    className="flex items-center justify-between mb-2 cursor-pointer hover:bg-zinc-200/50 p-1.5 -mx-1.5 rounded-lg select-none"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-zinc-700 flex items-center gap-2">
                        <Circle size={16} className="text-zinc-400" /> A Fazer
                      </h3>
                      {collapsed["TODO"] ? (
                        <ChevronRight size={16} className="text-zinc-400" />
                      ) : (
                        <ChevronDown size={16} className="text-zinc-400" />
                      )}
                    </div>
                    <span className="bg-zinc-200 text-zinc-600 text-xs font-bold px-2 py-1 rounded-full">
                      {getTasksByStatus("TODO").length}
                    </span>
                  </div>
                  {!collapsed["TODO"] &&
                    getTasksByStatus("TODO").map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.8 : 1,
                            }}
                          >
                            <TaskCard
                              task={task}
                              onEdit={(t) => {
                                setTaskToEdit(t);
                                setIsEditModalOpen(true);
                              }}
                              dragHandleProps={provided.dragHandleProps}
                              onRefresh={() => fetchAllData(false)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <Droppable droppableId="IN_PROGRESS">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-col gap-4 min-h-[100px] p-2 rounded-xl transition-colors ${
                    snapshot.isDraggingOver ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div
                    onClick={() => toggleCollapse("IN_PROGRESS")}
                    className="flex items-center justify-between mb-2 cursor-pointer hover:bg-blue-50 p-1.5 -mx-1.5 rounded-lg select-none"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-zinc-700 flex items-center gap-2">
                        <AlertCircle size={16} className="text-blue-500" /> Em
                        Andamento
                      </h3>
                      {collapsed["IN_PROGRESS"] ? (
                        <ChevronRight size={16} className="text-zinc-400" />
                      ) : (
                        <ChevronDown size={16} className="text-zinc-400" />
                      )}
                    </div>
                    <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                      {getTasksByStatus("IN_PROGRESS").length}
                    </span>
                  </div>
                  {!collapsed["IN_PROGRESS"] &&
                    getTasksByStatus("IN_PROGRESS").map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.8 : 1,
                            }}
                          >
                            <TaskCard
                              task={task}
                              onEdit={(t) => {
                                setTaskToEdit(t);
                                setIsEditModalOpen(true);
                              }}
                              dragHandleProps={provided.dragHandleProps}
                              onRefresh={() => fetchAllData(false)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <Droppable droppableId="DONE">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-col gap-4 min-h-[100px] p-2 rounded-xl transition-colors ${
                    snapshot.isDraggingOver ? "bg-green-50/50" : ""
                  }`}
                >
                  <div
                    onClick={() => toggleCollapse("DONE")}
                    className="flex items-center justify-between mb-2 cursor-pointer hover:bg-green-50 p-1.5 -mx-1.5 rounded-lg select-none"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-zinc-700 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" />{" "}
                        Concluído
                      </h3>
                      {collapsed["DONE"] ? (
                        <ChevronRight size={16} className="text-zinc-400" />
                      ) : (
                        <ChevronDown size={16} className="text-zinc-400" />
                      )}
                    </div>
                    <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded-full">
                      {getTasksByStatus("DONE").length}
                    </span>
                  </div>
                  {!collapsed["DONE"] &&
                    getTasksByStatus("DONE").map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.8 : 1,
                            }}
                          >
                            <TaskCard
                              task={task}
                              onEdit={(t) => {
                                setTaskToEdit(t);
                                setIsEditModalOpen(true);
                              }}
                              dragHandleProps={provided.dragHandleProps}
                              onRefresh={() => fetchAllData(false)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      )}

      <NewTaskModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onTaskCreated={() => fetchAllData(false)}
        categories={categories}
        friends={friends}
      />
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onTaskUpdated={() => fetchAllData(false)}
        task={taskToEdit}
        categories={categories}
        friends={friends}
      />

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: "#fff",
            color: "#27272a",
            fontFamily: '"Space Grotesk", sans-serif',
          },
        }}
      />
    </div>
  );
}
