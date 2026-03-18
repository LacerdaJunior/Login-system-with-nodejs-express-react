import { TaskService } from "../services/taskService.js";

const taskService = new TaskService();

export class TaskController {
  async create(req, res) {
    const { email, title, description, status, due_date, category_id } =
      req.body;

    if (!email || !title) {
      return res.status(400).json({ error: "Email and title are required!" });
    }

    try {
      await taskService.createNewTask(
        title,
        description,
        status,
        due_date,
        category_id,
        email
      );

      return res.status(201).json({ message: "Task created successfully!" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async index(req, res) {
    const email = req.headers["user-email"];

    if (!email) {
      return res.status(400).json({ error: "User not found to list tasks." });
    }
    
    try {
      const tasks = await taskService.getTasks(email);
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    const email = req.headers["user-email"];

    const taskId = req.params.id;

    if (!email || !taskId) {
      return res.status(400).json({ error: "Missing user email or task ID." });
    }

    try {
      await taskService.deleteTask(taskId, email);
      return res.status(200).json({ message: "Task has been deleted." });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
