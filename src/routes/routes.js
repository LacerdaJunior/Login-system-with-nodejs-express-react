import express from "express";
import { DatabasePostg } from "../repositories/database-postg.js";

const routes = express.Router();
const database = new DatabasePostg();

/* routes.get("/home", (req, res) => {});

routes.set("/login", (req, res) => {}); */

routes.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  await database.create({
    name,
    email,
    password,
  });

  return res.status(201).send("User created successfully!");
});

/* routes.put("/login", (req, res) => {}); */

export default routes;
