import express from "express";
import { UserController } from "../controllers/userController.js";
import { TaskController } from "../controllers/taskController.js";
import { CategoryController } from "../controllers/categoryController.js";

const routes = express.Router();
const userController = new UserController();
const taskController = new TaskController();
const categoryController = new CategoryController();

routes.post("/register", userController.register);
routes.post("/login", userController.login);
routes.patch("/dashboard/profile", userController.updateAvatar);
routes.patch("/dashboard/profile/updatepass", userController.updatePassword);
routes.delete("/dashboard/profile/deleteacc", userController.deleteUser);
routes.patch("/dashboard/profile/name", userController.updateUsername);
routes.post("/dashboard/tasks", taskController.create);
routes.post("/dashboard/categories", categoryController.create);

//================
// CRUD TASKS
//==============

routes.get("/dashboard/tasks", taskController.index);

routes.delete("/dashboard/tasks/:id", taskController.delete);

routes.patch("/dashboard/tasks/:id", taskController.update);

routes.delete("/dashboard/tasks/:id", taskController.delete);
export default routes;
