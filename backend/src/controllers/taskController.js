import { TaskService } from "../services/taskService.js";

const taskService = new TaskService();

export class TaskController {
  async create(req, res) {
    const userId = req.userId;
    const { title, description, status, due_date, category_id, assigned_to } =
      req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required!" });
    }

    try {
      await taskService.createNewTask(
        title,
        description || null,
        status,
        due_date || null,
        category_id || null,
        userId,
        assigned_to || null 
      );
      return res.status(201).json({ message: "Task created successfully!" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async index(req, res) {
    const userId = req.userId;
    try {
      const tasks = await taskService.getTasks(userId);
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    const userId = req.userId;
    const taskId = req.params.id;
    const data = req.body;
    if (!taskId) {
      return res.status(400).json({ error: "Missing taskId" });
    }
    try {
      await taskService.updateTask(taskId, userId, data);
      return res.status(200).json({ message: "Task updated successfully!" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    const userId = req.userId;
    const taskId = req.params.id;
    if (!taskId) {
      return res.status(400).json({ error: "Missing task ID." });
    }
    try {
      await taskService.deleteTask(taskId, userId);
      return res.status(200).json({ message: "Task has been deleted." });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
