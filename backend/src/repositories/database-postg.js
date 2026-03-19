import { randomUUID } from "node:crypto";
import sql from "../config/db.js";

export class DatabasePostg {
  async findByEmail(email) {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    return result[0];
  }

  async findById(id) {
    const result = await sql`SELECT * FROM users WHERE id = ${id}`;
    return result[0];
  }

  async create(user) {
    const userId = randomUUID();
    const { name, email, password } = user;
    await sql`INSERT INTO users (id, name, email, password) VALUES (${userId}, ${name}, ${email}, ${password})`;
  }

  async updateAvatar(id, avatar_url) {
    try {
      await sql`UPDATE users SET avatar_url = ${avatar_url} WHERE id = ${id}`;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(id, newPassword) {
    try {
      await sql`UPDATE users SET password = ${newPassword} WHERE id = ${id}`;
      return true;
    } catch (error) {
      throw new Error("Erro interno ao atualizar a senha no banco de dados.");
    }
  }

  async deleteUser(id) {
    try {
      await sql`DELETE FROM users WHERE id = ${id}`;
      return true;
    } catch (error) {
      throw new Error("Erro interno ao confirmar exclusão de conta");
    }
  }

  async updateUsername(id, newUsername) {
    try {
      await sql`UPDATE users SET name = ${newUsername} WHERE id = ${id}`;
      return true;
    } catch (error) {
      throw new Error("Erro interno ao atualizar o nome de usuário.");
    }
  }

  async createTask(title, description, status, due_date, category_id, user_id) {
    const taskId = randomUUID();
    try {
      await sql`
        INSERT INTO tasks (id, title, description, status, due_date, category_id, user_id) 
        VALUES (${taskId}, ${title}, ${description}, ${status}, ${due_date}, ${category_id}, ${user_id})
      `;
      return true;
    } catch (error) {
      throw new Error("Erro interno ao criar a tarefa.");
    }
  }

  async getTasksByUser(userId) {
    try {
      const tasks = await sql`
        SELECT 
          t.id, 
          t.title, 
          t.description, 
          t.status, 
          t.due_date, 
          t.created_at,
          c.id AS category_id, 
          c.name AS category_name, 
          c.color AS category_color
        FROM tasks t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = ${userId}
        ORDER BY t.created_at DESC
      `;
      return tasks;
    } catch (error) {
      throw new Error("Erro interno ao buscar as tarefas.");
    }
  }

  async deleteTaskByUser(taskId, userId) {
    try {
      await sql`DELETE FROM tasks WHERE id = ${taskId} AND user_id = ${userId}`;
      return true;
    } catch (error) {
      throw new Error("Erro interno ao excluir a tarefa.");
    }
  }

  async updateTask(id, userId, updateData) {
    try {
      await sql`UPDATE tasks SET ${sql(
        updateData
      )} WHERE id = ${id} AND user_id = ${userId}`;
      return true;
    } catch (error) {
      throw new Error("Erro interno ao atualizar a tarefa.");
    }
  }

  async createCategory(name, color, user_id) {
    const categorieId = randomUUID();
    try {
      await sql`INSERT INTO categories (id, name, color, user_id) VALUES (${categorieId}, ${name}, ${color}, ${user_id})`;
      return true;
    } catch (error) {
      throw new Error("Erro interno ao definir categoria no banco");
    }
  }

  async getCategoriesByUser(userId) {
    try {
      const categories = await sql`
        SELECT id, name, color 
        FROM categories 
        WHERE user_id = ${userId}
        ORDER BY name ASC
      `;
      return categories;
    } catch (error) {
      throw new Error("Erro interno ao buscar categorias.");
    }
  }

  async deleteCategory(categoryId, userId) {
    try {
      await sql`DELETE FROM categories WHERE id = ${categoryId} AND user_id = ${userId}`;
      return true;
    } catch (error) {
      throw new Error("Erro interno ao excluir a categoria.");
    }
  }
}
