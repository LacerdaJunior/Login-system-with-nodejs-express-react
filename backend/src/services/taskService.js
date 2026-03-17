import { DatabasePostg } from "../repositories/database-postg.js";

const database = new DatabasePostg();

export class TaskService {
  async createNewTask(title, email) {
    const user = await database.findByEmail(email);

    if (!user) {
      throw new Error("User not found to create task.");
    }

    await database.createTask(title, email);
  }
}
