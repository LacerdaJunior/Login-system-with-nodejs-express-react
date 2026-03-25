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
      console.error("Erro no update do banco:", error);
      throw error;
    }
  }

  async updatePassword(id, newPassword) {
    try {
      await sql`UPDATE users SET password = ${newPassword} WHERE id = ${id}`;
      return true;
    } catch (error) {
      throw new Error(
        "Erro interno ao atualizar a senha no banco de dados.",
        error
      );
    }
  }

  async deleteUser(id) {
    try {
      await sql`DELETE FROM users WHERE id = ${id}`;
      return true;
    } catch (error) {
      throw new Error("Erro interno ao confirmar exclusão de conta", error);
    }
  }

  async updateUsername(id, newUsername) {
    try {
      await sql`UPDATE users SET name = ${newUsername} WHERE id = ${id}`;
      return true;
    } catch (error) {
      throw new Error("Erro interno ao atualizar o nome de usuário.", error);
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
      throw new Error("Erro interno ao criar a tarefa.", error);
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
      throw new Error("Erro interno ao buscar as tarefas.", error);
    }
  }

  async deleteTaskByUser(taskId, userId) {
    try {
      await sql`DELETE FROM tasks WHERE id = ${taskId} AND user_id = ${userId}`;
      return true;
    } catch (error) {
      throw new Error("Erro interno ao excluir a tarefa.", error);
    }
  }

  async updateTask(id, userId, updateData) {
    try {
      await sql`UPDATE tasks SET ${sql(
        updateData
      )} WHERE id = ${id} AND user_id = ${userId}`;
      return true;
    } catch (error) {
      throw new Error("Erro interno ao atualizar a tarefa.", error);
    }
  }

  async createSubtask(taskId, title) {
    const subtaskId = randomUUID();

    try {
      await sql`
        INSERT INTO subtasks (id, title, is_completed, task_id) 
        VALUES (${subtaskId}, ${title}, false, ${taskId})
      `;
      return true;
    } catch (error) {
      console.error("Erro ao criar subtarefa no banco:", error);
      throw new Error("Erro interno ao criar item do checklist.");
    }
  }

  async getSubtasksByTaskId(taskId) {
    try {
      const subtasks = await sql`
        SELECT id, title, is_completed 
        FROM subtasks 
        WHERE task_id = ${taskId}
        ORDER BY title ASC
      `;
      return subtasks;
    } catch (error) {
      console.error("Erro ao buscar subtarefas no banco:", error);
      throw new Error("Erro interno ao buscar o checklist.");
    }
  }

  async toggleSubtaskStatus(subtaskId) {
    try {
      await sql`
        UPDATE subtasks 
        SET is_completed = NOT is_completed 
        WHERE id = ${subtaskId}
      `;
      return true;
    } catch (error) {
      console.error("Erro ao atualizar subtarefa no banco:", error);
      throw new Error("Erro interno ao atualizar status do checklist.");
    }
  }

  async deleteSubtask(subtaskId) {
    try {
      await sql`
        DELETE FROM subtasks 
        WHERE id = ${subtaskId}
      `;
      return true;
    } catch (error) {
      console.error("Erro ao excluir subtarefa no banco:", error);
      throw new Error("Erro interno ao excluir item do checklist.");
    }
  }

  async getAllSubtasksByUser(userId) {
    try {
      const subtasks = await sql`
        SELECT subtasks.* FROM subtasks
        INNER JOIN tasks ON subtasks.task_id = tasks.id
        WHERE tasks.user_id = ${userId}
      `;
      return subtasks;
    } catch (error) {
      console.error("Erro ao buscar as subtarefas do utilizador:", error);
      throw new Error("Erro interno ao procurar checklists.");
    }
  }

  async getMetrics(userId) {
    try {
      const metrics =
        await sql`SELECT status, COUNT(*) FROM tasks WHERE user_id = ${userId} GROUP BY status`;
      return metrics;
    } catch (error) {
      console.error("Erro ao trazer metricas no banco:", error);
      throw new Error("Erro interno ao trazer metricas do usuário.");
    }
  }

  async createCategory(name, color, user_id) {
    const categorieId = randomUUID();
    try {
      await sql`INSERT INTO categories (id, name, color, user_id) VALUES (${categorieId}, ${name}, ${color}, ${user_id})`;
      return true;
    } catch (error) {
      throw new Error("Erro interno ao definir categoria no banco", error);
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
      throw new Error("Erro interno ao buscar categorias.", error);
    }
  }

  async deleteCategory(categoryId, userId) {
    try {
      await sql`DELETE FROM categories WHERE id = ${categoryId} AND user_id = ${userId}`;
      return true;
    } catch (error) {
      throw new Error("Erro interno ao excluir a categoria.", error);
    }
  }

  async sendFriendRequest(senderID, receiverId) {
    try {
      await sql`INSERT INTO friendships (sender_id, receiver_id) VALUES (${senderID}, ${receiverId}) `;
    } catch (error) {
      throw new Error("Erro ao enviar solicitação de amizade.", error);
    }
  }

  async acceptFriendRequest(connectionId) {
    try {
      await sql`UPDATE friendships SET status = 'ACCEPTED' WHERE id =  ${connectionId} `;
    } catch (error) {
      throw new Error("Erro ao aceitas solicitação de amizade.", error);
    }
  }

  async getPendingRequests(userId) {
    try {
      const requests = await sql`
          SELECT 
              friendships.id,
              users.name,
              users.avatar_url
              FROM friendships
              INNER JOIN users 
              ON users.id = friendships.sender_id
              WHERE 
              friendships.receiver_id = ${userId}
              AND friendships.status = 'PENDING'
`;
      return requests;
    } catch (error) {
      throw new Error("Erro ao exibir solicitações de amizade.", error);
    }
  }

  async getFriends(userId) {
    try {
      const friends = await sql`SELECT users.id, users.name, users.avatar_url
       FROM users INNER JOIN
      friendships ON users.id = friendships.sender_id OR users.id = friendships.receiver_id
      WHERE (friendships.receiver_id = ${userId} OR friendships.sender_id = ${userId}) AND users.id != ${userId} AND friendships.status = 'ACCEPTED'
      `;

      return friends;
    } catch (error) {
      console.error("Erro ao buscar lista de amigos:", error);
      throw new Error("Erro ao carregar a sua rede de conexões.");
    }
  }

  async removeFriend(userId, friendId) {
    try {
      await sql`DELETE FROM friendships WHERE 
      (sender_id = ${userId} AND receiver_id = ${friendId}) 
      OR 
      (sender_id = ${friendId} AND receiver_id = ${userId})`;
    } catch (error) {
      console.error("Erro ao desfazer amizade:", error);
      throw new Error("Erro ao remover usuário da sua rede.");
    }
  }
}
