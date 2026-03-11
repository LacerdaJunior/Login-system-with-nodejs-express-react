import bcrypt from "bcrypt";
import { DatabasePostg } from "../repositories/database-postg.js";
import jwt from "jsonwebtoken";

const database = new DatabasePostg();

const JWT_SECRET = process.env.JWT_SECRET;

export class UserService {
  async registerUser(name, email, password) {
    const userAlreadyExists = await database.findByEmail(email);

    if (userAlreadyExists) {
      throw new Error("Email already in use.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await database.create({
      name,
      email,
      password: hashedPassword,
    });
  }

  async loginUser(email, password) {
    const user = await database.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password. ");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }
    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}
