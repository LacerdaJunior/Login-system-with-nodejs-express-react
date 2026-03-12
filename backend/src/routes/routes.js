import express from "express";
import { UserController } from "../controllers/userController.js";

const routes = express.Router();
const userController = new UserController();

routes.post("/register", userController.register);
routes.post("/login", userController.login);
routes.patch("/dashboard/avatar", userController.updateAvatar);
export default routes;
