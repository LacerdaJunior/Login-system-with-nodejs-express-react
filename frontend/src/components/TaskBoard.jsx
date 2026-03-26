import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { NewTaskModal } from "./NewTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { CategoriesManager } from "./CategoriesManager";
import toast, { Toaster } from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Plus, Calendar, MoreVertical, CheckCircle2, Circle, AlertCircle,
  Trash2, Edit2, UserPlus, GripVertical, Pin, Tag, ChevronDown,
  ChevronRight, Search, BarChart3, UserCheck, Clock
} from "lucide-react";

const formatarData = (dataString) => {
  if (!dataString) return "Sem data";
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};

const TaskCard = ({ task, onEdit, dragHandleProps }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("@LoginOne:user") || "{}");

  const isAssignee = task.assignee && task.assignee.id === user.id;

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
                  setTimeout(() => window.location.reload(), 1000);
                } catch (error) {
                  toast.error("Erro ao excluir a tarefa.", { id: loadingToast });
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

  return (
    <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 group relative font-space">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div {...dragHandleProps} className="text-zinc-400 hover:text-brand cursor-grab active:cursor-grabbing p-1 -ml-2 rounded">
            <GripVertical size={16} />
          </div>
          {task.category ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${task.category.color}20`, color: task.category.color }}>
              {task.category.name}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-500">
              Sem categoria
            </span>
          )}
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-zinc-300 hover:text-zinc-600 p-1 rounded-md hover:bg-zinc-100">
          <MoreVertical size={16} />
        </button>
        {isMenuOpen && (
          <div className="absolute top-10 right-4 w-40 bg-white border border-zinc-200 rounded-lg shadow-xl z-10 overflow-hidden flex flex-col">
            <button onClick={() => { setIsMenuOpen(false); onEdit(task); }} className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 text-left">
              <Edit2 size={14} /> Editar
            </button>
            <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left">
              <Trash2 size={14} /> Excluir
            </button>
          </div>
        )}
      </div>
      
      <div>
        <h4 className="font-bold text-zinc-800 text-sm mb-1">{task.title}</h4>
        <p className="text-xs text-zinc-500 line-clamp-2">{task.description || "Sem descrição..."}</p>
      </div>
      
      <div className="flex items-center justify-between mt-2 pt-3 border-t border-zinc-50">
        <div className={`flex items-center gap-1.5 text-xs font-medium ${task.status === "DONE" ? "text-green-500" : "text-zinc-400"}`}>
          {task.status === "DONE" ? <CheckCircle2 size={14} /> : <Calendar size={14} />}
          <span>{formatarData(task.due_date)}</span>
        </div>
        
        {/* Renderização do Assignee ou do Dono */}
        <div className="flex items-center gap-1">
          {task.assignee ? (
            <div className="flex items-center gap-2" title={`Responsável: ${task.assignee.name}`}>
              <img src={task.assignee.avatar_url} alt="Assignee" className="w-6 h-6 rounded-full border border-zinc-200 object-cover shadow-sm" />
              {isAssignee && <span className="text-[10px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full">Para Mim</span>}
            </div>
          ) : (
             <div className="w-6 h-6 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[10px] font-bold shadow-sm" title="Você é o dono">VC</div>
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
  
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await api.get("/dashboard/network/friends");
        setFriends(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFriends();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if(!searchQuery) return;
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
      await api.post("/dashboard/network/add", { receiverId });
      toast.success("Convite enviado!");
      setSearchResult(null);
      setSearchQuery("");
    } catch (error) {
      toast.error("Erro ao enviar convite.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm font-space">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><UserPlus className="text-brand"/> Buscar Conexões</h3>
      
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-zinc-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por @username..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-brand outline-none"
          />
        </div>
        <button type="submit" className="bg-zinc-900 text-white px-6 font-bold rounded-xl hover:bg-black transition-colors">Buscar</button>
      </form>

      {searchResult && (
        <div className="mb-8 p-4 border-2 border-brand/20 bg-brand/5 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={searchResult.avatar_url} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
            <div>
              <p className="font-bold text-zinc-800">{searchResult.name}</p>
              <p className="text-sm text-zinc-500">@{searchResult.username}</p>
            </div>
          </div>
          <button onClick={() => handleSendInvite(searchResult.id)} className="bg-brand text-white px-4 py-2 rounded-lg font-bold hover:opacity-90">
            Adicionar
          </button>
        </div>
      )}

      <h4 className="font-bold text-zinc-700 mb-4 border-b pb-2">Minha Rede ({friends.length})</h4>
      {friends.length === 0 ? (
        <p className="text-zinc-500 text-sm italic">Você ainda não possui conexões.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {friends.map(friend => (
            <div key={friend.id} className="flex items-center gap-3 p-3 border border-zinc-100 rounded-xl hover:shadow-sm">
              <img src={friend.avatar_url} alt="amigo" className="w-10 h-10 rounded-full object-cover" />
              <p className="font-bold text-sm text-zinc-800 truncate">{friend.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



export function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [collapsed, setCollapsed] = useState({ TODO: false, IN_PROGRESS: false, DONE: false });
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [activeTab, setActiveTab] = useState("board");

  useEffect(() => {
    async function fetchData() {
      try {
        const [tasksRes, catRes] = await Promise.all([
          api.get("/dashboard/tasks"),
          api.get("/dashboard/categories"),
        ]);
        setTasks(tasksRes.data);
        setCategories(catRes.data);
      } catch (error) {
        toast.error("Erro ao carregar os dados.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    setTasks((prev) => prev.map((t) => t.id === draggableId ? { ...t, status: newStatus } : t));

    try {
      await api.patch(`/dashboard/tasks/${draggableId}`, { status: newStatus });
    } catch (error) {
      toast.error("Erro ao salvar posição.");
      window.location.reload();
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => {
      const matchesStatus = task.status === status;
      const matchesCategory = selectedFilter === "ALL" || (task.category && task.category.id === selectedFilter);
      return matchesStatus && matchesCategory;
    });
  };

  const toggleCollapse = (status) => setCollapsed((prev) => ({ ...prev, [status]: !prev[status] }));

  if (isLoading) return <div className="w-full h-screen flex items-center justify-center bg-zinc-50/50"><p className="text-zinc-500 font-bold animate-pulse font-space">Carregando painel...</p></div>;

  return (
    <div className="w-full h-full p-4 sm:p-8 bg-zinc-50/50 relative font-space">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800 tracking-tight">O Meu Painel</h2>
          <p className="text-zinc-500 text-sm mt-1">Gira os seus projetos, rede e métricas.</p>
        </div>

        {activeTab === "board" && (
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-brand cursor-pointer"
            >
              <option value="ALL">Todas as Categorias</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
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

      <div className="flex items-center gap-6 border-b border-zinc-200 mb-8 overflow-x-auto custom-scrollbar">
        {[
          { id: "board", icon: <Pin size={16}/>, label: "Meu Quadro" },
          { id: "categories", icon: <Tag size={16}/>, label: "Categorias" },
          { id: "network", icon: <UserPlus size={16}/>, label: "Rede" },
          { id: "metrics", icon: <BarChart3 size={16}/>, label: "Métricas" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-3 text-sm font-bold transition-colors relative whitespace-nowrap ${
              activeTab === tab.id ? "text-brand" : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            {tab.icon} {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand rounded-t-full"></div>}
          </button>
        ))}
      </div>

      {activeTab === "categories" && <CategoriesManager />}
      {activeTab === "network" && <NetworkTab />}
      
      {activeTab === "metrics" && (
         <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-center min-h-[300px]">
             <div className="text-center space-y-4">
                <BarChart3 size={48} className="text-brand mx-auto opacity-50" />
                <h3 className="text-xl font-bold text-zinc-700">Métricas e Progresso</h3>
                <p className="text-zinc-500">A visualização gráfica das suas tarefas concluídas está sendo gerada.</p>
             </div>
         </div>
      )}

      {activeTab === "board" && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            {/* COLUNA A FAZER */}
            <Droppable droppableId="TODO">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className={`flex flex-col gap-4 min-h-[100px] p-2 rounded-xl transition-colors ${snapshot.isDraggingOver ? "bg-zinc-100" : ""}`}>
                  <div onClick={() => toggleCollapse("TODO")} className="flex items-center justify-between mb-2 cursor-pointer hover:bg-zinc-200/50 p-1.5 -mx-1.5 rounded-lg select-none">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-zinc-700 flex items-center gap-2"><Circle size={16} className="text-zinc-400" /> A Fazer</h3>
                      {collapsed["TODO"] ? <ChevronRight size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
                    </div>
                    <span className="bg-zinc-200 text-zinc-600 text-xs font-bold px-2 py-1 rounded-full">{getTasksByStatus("TODO").length}</span>
                  </div>
                  {!collapsed["TODO"] && getTasksByStatus("TODO").map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} style={{...provided.draggableProps.style, opacity: snapshot.isDragging ? 0.8 : 1}}>
                          <TaskCard task={task} onEdit={(t) => { setTaskToEdit(t); setIsEditModalOpen(true); }} dragHandleProps={provided.dragHandleProps} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* COLUNA EM ANDAMENTO */}
            <Droppable droppableId="IN_PROGRESS">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className={`flex flex-col gap-4 min-h-[100px] p-2 rounded-xl transition-colors ${snapshot.isDraggingOver ? "bg-blue-50/50" : ""}`}>
                  <div onClick={() => toggleCollapse("IN_PROGRESS")} className="flex items-center justify-between mb-2 cursor-pointer hover:bg-blue-50 p-1.5 -mx-1.5 rounded-lg select-none">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-zinc-700 flex items-center gap-2"><AlertCircle size={16} className="text-blue-500" /> Em Andamento</h3>
                      {collapsed["IN_PROGRESS"] ? <ChevronRight size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
                    </div>
                    <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">{getTasksByStatus("IN_PROGRESS").length}</span>
                  </div>
                  {!collapsed["IN_PROGRESS"] && getTasksByStatus("IN_PROGRESS").map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} style={{...provided.draggableProps.style, opacity: snapshot.isDragging ? 0.8 : 1}}>
                          <TaskCard task={task} onEdit={(t) => { setTaskToEdit(t); setIsEditModalOpen(true); }} dragHandleProps={provided.dragHandleProps} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* COLUNA CONCLUÍDO */}
            <Droppable droppableId="DONE">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className={`flex flex-col gap-4 min-h-[100px] p-2 rounded-xl transition-colors ${snapshot.isDraggingOver ? "bg-green-50/50" : ""}`}>
                  <div onClick={() => toggleCollapse("DONE")} className="flex items-center justify-between mb-2 cursor-pointer hover:bg-green-50 p-1.5 -mx-1.5 rounded-lg select-none">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-zinc-700 flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Concluído</h3>
                      {collapsed["DONE"] ? <ChevronRight size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
                    </div>
                    <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded-full">{getTasksByStatus("DONE").length}</span>
                  </div>
                  {!collapsed["DONE"] && getTasksByStatus("DONE").map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} style={{...provided.draggableProps.style, opacity: snapshot.isDragging ? 0.8 : 1}}>
                          <TaskCard task={task} onEdit={(t) => { setTaskToEdit(t); setIsEditModalOpen(true); }} dragHandleProps={provided.dragHandleProps} />
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

      <NewTaskModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} onTaskCreated={() => window.location.reload()} categories={categories} />
      <EditTaskModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onTaskUpdated={() => window.location.reload()} task={taskToEdit} />

      <Toaster position="top-center" toastOptions={{ style: { borderRadius: "12px", background: "#fff", color: "#27272a", fontFamily: '"Space Grotesk", sans-serif' } }} />
    </div>
  );
}