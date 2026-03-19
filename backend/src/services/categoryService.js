import { DatabasePostg } from "../repositories/database-postg.js";

const database = new DatabasePostg();

export class CategoryService {
  async createNewCategory(name, color, userId) {
    const user = await database.findById(userId);
    if (!user) {
      throw new Error("User not found for this category.");
    }
    await database.createCategory(name, color, userId);
  }

  async getCategories(userId) {
    return await database.getCategoriesByUser(userId);
  }

  async deleteCategory(categoryId, userId) {
    await database.deleteCategory(categoryId, userId);
  }
}
