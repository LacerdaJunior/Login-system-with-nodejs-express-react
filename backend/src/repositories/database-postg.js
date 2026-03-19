import { randomUUID } from "node:crypto";
import sql from "../config/db.js";

export class DatabasePostg {
  async findByEmail(email) {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;

    return result[0];
  }
  async create(user) {
    const userId = randomUUID();

    const { name, email, password } = user;

    await sql`insert into users  (id, name, email, password) VALUES (${userId}, ${name}, ${email}, ${password})`;
  }

  async updateAvatar(email, avatar_url) {
    try {
      await sql`UPDATE users SET avatar_url = ${avatar_url} WHERE email= ${email} `;
    } catch (error) {
      console.error("Erro no update do banco:", error);
      throw error;
    }
  }

  async updatePassword(email, newPassword) {
    try {
      await sql`
        UPDATE users 
        SET password = ${newPassword} 
        WHERE email = ${email}
      `;

      return true;
    } catch (error) {
      console.error("Erro ao atualizar senha no banco:", error);
      throw new Error("Erro interno ao atualizar a senha no banco de dados.");
    }
  }

  async deleteUser(email) {
    try {
      await sql`
      DELETE FROM users WHERE email = ${email}
      `;
      return true;
    } catch (error) {
      console.log("Erro ao excluir conta no banco:", error);
      throw new Error("Erro interno ao confirmar exclusão de conta");
    }
  }

  async updateUsername(email, newUsername) {
    try {
      await sql`UPDATE users 
      SET name = ${newUsername} 
      WHERE email = ${email}`;

      return true;
    } catch (error) {
      console.error("Erro ao atualizar nome no banco", error);
      throw new Error("Erro interno ao atualizar o nome de usuário.");
    }
  }

  // ==========================================
  // MÉTODOS DE TAREFAS (TASKS)
  // ==========================================

  async createTask(
    title,
    description,
    status,
    due_date,
    category_id,
    user_email
  ) {
    const taskId = randomUUID();

    try {
      await sql`
        INSERT INTO tasks (id, title, description, status, due_date, category_id, user_email) 
        VALUES (${taskId}, ${title}, ${description}, ${status}, ${due_date}, ${category_id}, ${user_email})
      `;
      return true;
    } catch (error) {
      console.error("Erro ao criar tarefa no banco:", error);
      throw new Error("Erro interno ao criar a tarefa.");
    }
  }

  async getTasksByUser(email) {
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
        WHERE t.user_email = ${email}
        ORDER BY t.created_at DESC
      `;

      return tasks;
    } catch (error) {
      console.error("Erro ao buscar tarefas no banco:", error);
      throw new Error("Erro interno ao buscar as tarefas.");
    }
  }

  async deleteTaskByUser(taskId, email) {
    try {
      await sql`
      DELETE FROM tasks 
      WHERE id = ${taskId} AND user_email = ${email}
    `;
      return true;
    } catch (error) {
      console.log("Erro ao excluir tarefa no banco:", error);
      throw new Error("Erro interno ao excluir a tarefa.");
    }
  }

  async updateTask(id, email, updateData) {
    try {
      await sql`
        UPDATE tasks 
        SET ${sql(updateData)} 
        WHERE id = ${id} AND user_email = ${email}
      `;
      return true;
    } catch (error) {
      console.log("Erro ao atualizar tarefa no banco:", error);
      throw new Error("Erro interno ao atualizar a tarefa.");
    }
  }

  // ==========================================
  // MÉTODOS DE CATEGORIAS (CATEGORY/IES)
  // ==========================================

  async createCategory(name, color, user_email) {
    const categorieId = randomUUID();

    try {
      await sql`INSERT INTO categories (id, name, color, user_email) VALUES (${categorieId}, ${name}, ${color}, ${user_email} )`;
      return true;
    } catch (error) {
      console.log("Erro ao definir categoria", error);
      throw new Error("Erro interno ao definir categoria no banco");
    }
  }
}
