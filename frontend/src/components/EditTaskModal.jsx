import { useState, useEffect } from "react";
import {
  X,
  Users,
  ListTodo,
  Trash2,
  Plus,
  Calendar,
  Tag,
  Info,
} from "lucide-react";
import { api } from "../services/api";
import toast from "react-hot-toast";

const formatarDataBR = (dataString) => {
  if (!dataString) return "Sem data definida";
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export function EditTaskModal({
  isOpen,
  onClose,
  onTaskUpdated,
  task,
  categories = [],
  friends = [],
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = JSON.parse(
    localStorage.getItem("@LoginOne:user") || "{}"
  );
  const isOwner = task?.owner_id === currentUser.id;

  useEffect(() => {
    if (task && isOpen) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setCategoryId(task.category?.id || "");
      setAssignedTo(task.assignee?.id || "");
      if (task.due_date) {
        const date = new Date(task.due_date);
        setDueDate(date.toISOString().split("T")[0]);
      } else {
        setDueDate("");
      }
      fetchSubtasks(task.id);
    }
  }, [task, isOpen]);

  const fetchSubtasks = async (taskId) => {
    try {
      const response = await api.get(`/dashboard/tasks/${taskId}/subtasks`);
      setSubtasks(response.data);
    } catch (error) {
      console.error("Erro ao carregar checklist", error);
    }
  };

  if (!isOpen || !task) return null;

  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter((s) => s.is_completed).length;
  const progressPercent =
    totalSubtasks === 0
      ? 0
      : Math.round((completedSubtasks / totalSubtasks) * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOwner) return;
    setIsSubmitting(true);
    const loadingToast = toast.loading("Salvando alterações...");
    try {
      await api.patch(`/dashboard/tasks/${task.id}`, {
        title,
        description,
        due_date: dueDate || null,
        category_id: categoryId || null,
        assigned_to: assignedTo || null,
      });
      toast.success("Tarefa atualizada!", { id: loadingToast });
      onTaskUpdated();
      onClose();
    } catch (error) {
      toast.error("Erro ao atualizar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || !isOwner) return;
    try {
      await api.post(`/dashboard/tasks/${task.id}/subtasks`, {
        title: newSubtaskTitle,
      });
      setNewSubtaskTitle("");
      await fetchSubtasks(task.id);
      onTaskUpdated(); 
    } catch (error) {
      toast.error("Erro ao adicionar item.");
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    try {
  
      setSubtasks(
        subtasks.map((s) =>
          s.id === subtaskId ? { ...s, is_completed: !s.is_completed } : s
        )
      );
      await api.patch(`/dashboard/subtasks/${subtaskId}/toggle`);
      onTaskUpdated(); 
    } catch (error) {
      toast.error("Erro ao marcar item.");
      fetchSubtasks(task.id);
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    if (!isOwner) return;
    try {
      await api.delete(`/dashboard/subtasks/${subtaskId}`);
      await fetchSubtasks(task.id);
      onTaskUpdated(); 
    } catch (error) {
      toast.error("Erro ao deletar item.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative font-space flex flex-col max-h-[90vh] overflow-hidden">
        <div className="bg-zinc-50 border-b border-zinc-200 px-4 sm:px-6 py-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-800 flex items-center gap-2">
              <Info size={20} className="text-brand" />{" "}
              {isOwner ? "Editar Tarefa" : "Detalhes da Tarefa"}
            </h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-700 bg-white rounded-full p-1.5 shadow-sm border border-zinc-200"
            >
              <X size={18} />
            </button>
          </div>
          {totalSubtasks > 0 && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] sm:text-xs font-bold text-zinc-500">
                  Progresso do Checklist
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-brand">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-2">
                <div
                  className="bg-brand h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar border-b md:border-b-0 md:border-r border-zinc-100">
            {!isOwner && (
              <div className="bg-brand/10 border border-brand/20 p-3 rounded-lg mb-6 flex items-start gap-3">
                <Users size={20} className="text-brand shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-brand">
                  Você foi atribuído a esta tarefa. Marque os checklists abaixo
                  para demonstrar seu progresso.
                </p>
              </div>
            )}
            {isOwner ? (
              <form
                id="edit-task-form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
              >
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:border-brand outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:border-brand outline-none resize-none h-28 bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">
                      Entrega
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:border-brand outline-none text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">
                      Categoria
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:border-brand outline-none text-sm bg-white"
                    >
                      <option value="">Nenhuma</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 mb-1">
                    <Users size={16} className="text-brand" /> Responsável
                  </label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:border-brand outline-none text-sm bg-zinc-50"
                  >
                    <option value="">Apenas eu</option>
                    {friends.map((friend) => (
                      <option key={friend.id} value={friend.id}>
                        {friend.name}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-zinc-800">
                    {task.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-3">
                    {task.category && (
                      <span
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: `${task.category.color}15`,
                          color: task.category.color,
                        }}
                      >
                        <Tag size={12} /> {task.category.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-600">
                      <Calendar size={12} /> {formatarDataBR(task.due_date)}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                    Descrição
                  </h4>
                  <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 min-h-[100px]">
                    <p className="text-sm text-zinc-700 whitespace-pre-wrap">
                      {task.description || (
                        <span className="italic text-zinc-400">
                          Nenhuma descrição.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full md:w-80 bg-white md:bg-zinc-50/50 p-4 sm:p-6 flex flex-col h-full border-t md:border-t-0 border-zinc-100">
            <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
              <ListTodo size={18} className="text-brand" /> Lista de Tarefas
            </h3>

            <div className="max-h-[150px] md:max-h-[300px] overflow-y-auto custom-scrollbar pr-2 mb-4 space-y-2 border border-zinc-100 rounded-lg p-2 bg-white">
              {subtasks.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-xs text-zinc-400 font-medium">
                    Nenhum item adicionado.
                  </p>
                </div>
              ) : (
                subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-start gap-3 p-2 hover:bg-zinc-50 rounded-lg group transition-colors border border-transparent hover:border-zinc-200"
                  >
                    <input
                      type="checkbox"
                      checked={subtask.is_completed}
                      onChange={() => handleToggleSubtask(subtask.id)}
                      className="mt-0.5 w-4 h-4 accent-brand cursor-pointer shrink-0 rounded border-zinc-300"
                    />
                    <span
                      className={`text-sm flex-1 font-medium ${
                        subtask.is_completed
                          ? "line-through text-zinc-400"
                          : "text-zinc-700"
                      }`}
                    >
                      {subtask.title}
                    </span>
                    {isOwner && (
                      <button
                        onClick={() => handleDeleteSubtask(subtask.id)}
                        className="text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {isOwner && (
              <form onSubmit={handleAddSubtask} className="mt-auto">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Adicionar item..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:border-brand outline-none shadow-sm"
                  />
                  <button
                    type="submit"
                    disabled={!newSubtaskTitle.trim()}
                    className="bg-brand text-white p-2 rounded-lg hover:bg-brand/90 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </form>
            )}

            {isOwner && (
              <button
                form="edit-task-form"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-zinc-900 text-white font-bold py-3 rounded-xl mt-4 hover:bg-black transition-colors disabled:opacity-50 shadow-md"
              >
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
