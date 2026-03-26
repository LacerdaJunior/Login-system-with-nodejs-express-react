import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { UserController } from "../src/controllers/userController.js";
import { UserService } from "../src/services/userService.js";

describe("UserController - register", () => {
  let userController;
  let req;
  let res;

  beforeEach(() => {
    userController = new UserController();

    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("deve retornar 400 se faltar algum campo obrigatório", async () => {
    req = {
      body: {
        name: "Guilherme Lacerda",
        email: "gui@teste.com",
        username: "lacerdazjr",
      },
    };

    await userController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      "Name, email, password and username must be filled!"
    );
  });

  it("deve retornar 201 quando o usuário for criado com sucesso", async () => {
    req = {
      body: {
        name: "Guilherme Lacerda",
        email: "gui@teste.com",
        password: "senha-segura",
        username: "lacerdazjr",
      },
    };

    vi.spyOn(UserService.prototype, "registerUser").mockResolvedValue();

    await userController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith("User created successfully!");
  });

  it("deve retornar 409 quando o email ou username já estiver em uso", async () => {
    req = {
      body: {
        name: "Guilherme Lacerda",
        email: "gui@teste.com",
        password: "senha-segura",
        username: "lacerdazjr",
      },
    };

    vi.spyOn(UserService.prototype, "registerUser").mockRejectedValue(
      new Error("Username already in use.")
    );

    await userController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toHaveBeenCalledWith("Username already in use.");
  });

  it("deve retornar 500 se ocorrer um erro interno desconhecido", async () => {
    req = {
      body: {
        name: "Guilherme Lacerda",
        email: "gui@teste.com",
        password: "senha-segura",
        username: "lacerdazjr",
      },
    };

    vi.spyOn(UserService.prototype, "registerUser").mockRejectedValue(
      new Error("Database connection failed")
    );

    await userController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Internal Server Error.");
  });
});
