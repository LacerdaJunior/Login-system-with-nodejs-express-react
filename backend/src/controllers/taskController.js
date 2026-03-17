import { TaskService } from "../services/taskService.js";

const taskService = new TaskService();

export class TaskController {
  async create(req, res) {
    const { email, title } = req.body;

    if (!email || !title) {
      return res.status(400).send("All data must be filled!");
    }

    try {
      await taskService.createNewTask(title, email);
      return res.status(200).send("Task created successfully!");
    } catch (error) {
      return res.tatus(400).json({ error: error.message });
    }
  }
}
