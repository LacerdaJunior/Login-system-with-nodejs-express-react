import { DatabasePostg } from "../repositories/database-postg.js";

const database = new DatabasePostg();

export class TaskService {
  async createNewTask(
    title,
    description,
    status,
    due_date,
    category_id,
    email
  ) {
    const user = await database.findByEmail(email);

    if (!user) {
      throw new Error("User not found to create task.");
    }

    await database.createTask(
      title,
      description,
      status,
      due_date,
      category_id,
      email
    );
  }

  async getTasks(email) {
    const rawTasks = await database.getTasksByUser(email);

    const taskList = rawTasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      due_date: task.due_date,
      created_at: task.created_at,
      category: task.category_id
        ? {
            id: task.category_id,
            name: task.category_name,
            color: task.category_color,
          }
        : null,
    }));
    return taskList;
  }

  async updateTask(taskId, email, data) {
    await database.updateTask(taskId, email, data);
  }

  async deleteTask(taskId, email) {
    await database.deleteTask(taskId, email);
  }
}
