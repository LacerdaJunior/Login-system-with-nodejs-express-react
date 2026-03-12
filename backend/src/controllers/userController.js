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
    const { email, mascotName } = req.body;

    if (!email || !mascotName) {
      return res.status(400).send("Email and mascot must be filled!");
    }

    try {
      await userService.changeAvatar(email, mascotName);
      return res.status(200).json("Avatar updated successfully!");
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
}
