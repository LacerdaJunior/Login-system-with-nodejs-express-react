import { UserService } from "../services/userService.js";

const userService = new UserService();

export class UserController {
  async register(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send("Name, email and password must be filled!");
    }
    try {
      await userService.registerUser(name, email, password);
      return res.status(201).send("User created successfully!");
    } catch (error) {
      if (error.message === "Email already in use") {
        return res.status(409).send(error.message);
      }
      return res.status(500).send("Intern Error.");
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password must be filled!");
    }
    try {
      const loginData = await userService.loginUser(email, password);
      return res.status(200).json(loginData);
    } catch (error) {
      return res.status(401).send(error.message);
    }
  }

  async updateAvatar(req, res) {
    const userId = req.userId;
    const { avatar_url } = req.body;
    if (!avatar_url) {
      return res.status(400).send("Avatar must be filled!");
    }
    try {
      await userService.changeAvatar(userId, avatar_url);
      return res.status(200).json("Avatar updated successfully!");
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updatePassword(req, res) {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).send("All data must be filled!");
    }
    try {
      await userService.changePassword(userId, oldPassword, newPassword);
      return res.status(200).json("Password updated successfully!");
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    const userId = req.userId;
    const { password } = req.body;
    if (!password) {
      return res.status(400).send("Password must be filled!");
    }
    try {
      await userService.deleteAccount(userId, password);
      return res.status(200).json("Account has been deleted");
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updateUsername(req, res) {
    const userId = req.userId;
    const { newUsername } = req.body;
    if (!newUsername) {
      return res.status(400).send("Username must be filled!");
    }
    try {
      await userService.changeUsername(userId, newUsername);
      return res.status(200).json("Username updated successfully!");
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
