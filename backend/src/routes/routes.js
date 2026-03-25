import express from "express";
import { UserController } from "../controllers/userController.js";
import { TaskController } from "../controllers/taskController.js";
import { CategoryController } from "../controllers/categoryController.js";
import { ensureAuthenticated } from "../middlewares/authMiddleware.js";
import { SubtaskController } from "../controllers/subtaskController.js";
import { MetricsController } from "../controllers/metricsController.js";
import { ProgressController } from "../controllers/progressController.js";
import { FriendshipController } from "../controllers/friendshipController.js";

const routes = express.Router();
const userController = new UserController();
const taskController = new TaskController();
const categoryController = new CategoryController();
const subtaskController = new SubtaskController();
const metricsController = new MetricsController();
const progressController = new ProgressController();
const friendshipController = new FriendshipController();

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


routes.post("/dashboard/tasks/:taskId/subtasks", ensureAuthenticated, subtaskController.create);
routes.get("/dashboard/tasks/:taskId/subtasks", ensureAuthenticated, subtaskController.index);
routes.patch("/dashboard/subtasks/:id/toggle", ensureAuthenticated, subtaskController.toggle);
routes.delete("/dashboard/subtasks/:id", ensureAuthenticated, subtaskController.delete);

//sessão metricas do usuario/progresso.
routes.get("/dashboard/tasks/progress", ensureAuthenticated, progressController.index);

routes.get("/dashboard/metrics", ensureAuthenticated, metricsController.index);

//sessão rede de amizades:
routes.post("/friends/request", ensureAuthenticated, friendshipController.send);
routes.patch("/friends/accept/:id", ensureAuthenticated, friendshipController.accept);
routes.get("/friends/pending", ensureAuthenticated, friendshipController.pending);
routes.get("/friends", ensureAuthenticated, friendshipController.list);
routes.delete("/friends/:friendId", ensureAuthenticated, friendshipController.remove);

export default routes;