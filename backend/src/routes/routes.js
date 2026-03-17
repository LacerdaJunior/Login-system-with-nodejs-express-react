import express from "express";
import { UserController } from "../controllers/userController.js";

const routes = express.Router();
const userController = new UserController();

routes.post("/register", userController.register);
routes.post("/login", userController.login);
routes.patch("/dashboard/profile", userController.updateAvatar);
routes.patch("/dashboard/profile/updatepass", userController.updatePassword);
routes.delete("/dashboard/profile/deleteacc", userController.deleteUser);
routes.patch("/dashboard/profile/name", userController.updateUsername);
export default routes;
