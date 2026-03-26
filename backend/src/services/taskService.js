import { DatabasePostg } from "../repositories/database-postg.js";

const database = new DatabasePostg();

export class TaskService {
  async createNewTask(
    title,
    description,
    status,
    due_date,
    category_id,
    userId,
    assigned_to
  ) {
    const user = await database.findById(userId);
    if (!user) {
      throw new Error("User not found to create task.");
    }

    if (assigned_to) {
      if (assigned_to === userId) {
        throw new Error("You cannot assign a task to yourself.");
      }

      const friends = await database.areFriends(userId, assigned_to);
      if (!friends) {
        throw new Error("You can only assign tasks to accepted friends.");
      }
    }

    await database.createTask(
      title,
      description,
      status,
      due_date,
      category_id,
      userId,
      assigned_to
    );
  }

  async getTasks(userId) {
    const rawTasks = await database.getTasksByUser(userId);
    const taskList = rawTasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      due_date: task.due_date,
      created_at: task.created_at,
      assigned_to: task.assigned_to || null,
      category: task.category_id
        ? {
            id: task.category_id,
            name: task.category_name,
            color: task.category_color,
          }
        : null,
      assignee: task.assignee_id
        ? {
            id: task.assignee_id,
            name: task.assignee_name,
            avatar_url: task.assignee_avatar,
          }
        : null,
    }));
    return taskList;
  }

  async updateTask(taskId, userId, data) {
    await database.updateTask(taskId, userId, data);
  }

  async deleteTask(taskId, userId) {
    await database.deleteTaskByUser(taskId, userId);
  }
}
