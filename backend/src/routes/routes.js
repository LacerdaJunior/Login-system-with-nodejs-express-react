import express from "express";
import { UserController } from "../controllers/userController.js";
import { TaskController } from "../controllers/taskController.js";
import { CategoryController } from "../controllers/categoryController.js";
import { ensureAuthenticated } from "../middlewares/authMiddleware.js";

const routes = express.Router();
const userController = new UserController();
const taskController = new TaskController();
const categoryController = new CategoryController();

routes.post("/register", userController.register);
routes.post("/login", userController.login);

routes.patch("/dashboard/profile", ensureAuthenticated, userController.updateAvatar);
routes.patch("/dashboard/profile/updatepass", ensureAuthenticated, userController.updatePassword);
routes.delete("/dashboard/profile/deleteacc", ensureAuthenticated, userController.deleteUser);
routes.patch("/dashboard/profile/name", ensureAuthenticated, userController.updateUsername);

routes.get("/dashboard/categories", ensureAuthenticated, categoryController.index);
routes.post("/dashboard/categories", ensureAuthenticated, categoryController.create);
routes.delete("/dashboard/categories/:id", ensureAuthenticated, categoryController.delete);

routes.get("/dashboard/tasks", ensureAuthenticated, taskController.index);
routes.post("/dashboard/tasks", ensureAuthenticated, taskController.create);
routes.patch("/dashboard/tasks/:id", ensureAuthenticated, taskController.update);
routes.delete("/dashboard/tasks/:id", ensureAuthenticated, taskController.delete);

export default routes;