import { randomUUID } from "node:crypto";
import sql from "../config/db.js";

export class DatabasePostg {
  async create(user) {
    const userId = randomUUID();

    const { name, email, password } = user;

    await sql`insert into users  (id, name, email, password) VALUES (${userId}, ${name}, ${email}, ${password})`;
  }
}
