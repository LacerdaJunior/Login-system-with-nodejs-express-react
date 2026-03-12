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
}
