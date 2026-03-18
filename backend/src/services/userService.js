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
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
      },
    };
  }

  async changeAvatar(email, avatar_url) {
    const user = await database.findByEmail(email);

    if (!user) {
      throw new Error("User not found ");
    }

    await database.updateAvatar(email, avatar_url);
  }

  async changePassword(email, oldPassword, newPassword) {
    const user = await database.findByEmail(email);

    if (!user) {
      throw new Error("invalid user request");
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await database.updatePassword(email, newHashedPassword);
  }

  async deleteAccount(email, password) {
    const user = await database.findByEmail(email);

    if (!user) {
      throw new Error("Invalid user");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    await database.deleteUser(email);
  }

  async changeUsername(email, newUsername) {
    const user = await database.findByEmail(email);

    if (!user) {
      throw new Error("Invalid user");
    }

    await database.updateUsername(email, newUsername);
  }
  
}
