import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TaskService } from "../src/services/taskService.js";
import { DatabasePostg } from "../src/repositories/database-postg.js";

describe("TaskService - getTasks", () => {
  let taskService;

  beforeEach(() => {
    taskService = new TaskService();
  });

  afterEach(() => {

    vi.restoreAllMocks();
  });

  it("deve retornar a tarefa com o objeto assignee formatado quando a tarefa for delegada", async () => {

    const rawDataFromDB = [
      {
        id: "task-123",
        title: "Configurar Servidor",
        description: "Subir na AWS",
        status: "PENDING",
        due_date: "2026-03-30",
        created_at: "2026-03-25",
        assignee_id: "user-999",
        assignee_name: "João Amigo",
        assignee_avatar: "http://foto.com/joao.png",
        category_id: null,
      },
    ];


    vi.spyOn(DatabasePostg.prototype, "getTasksByUser").mockResolvedValue(
      rawDataFromDB
    );


    const result = await taskService.getTasks("my-user-id");


    expect(result).toHaveLength(1);
    expect(result[0].assignee).toEqual({
      id: "user-999",
      name: "João Amigo",
      avatar_url: "http://foto.com/joao.png",
    });
  });

  it("deve retornar assignee como null quando a tarefa não tiver responsável", async () => {
    const rawDataFromDB = [
      {
        id: "task-456",
        title: "Estudar Vitest",
        description: "Fazer testes unitários",
        status: "IN_PROGRESS",
        due_date: "2026-03-26",
        created_at: "2026-03-25",
        assignee_id: null,
        assignee_name: null,
        assignee_avatar: null,
        category_id: null,
      },
    ];


    vi.spyOn(DatabasePostg.prototype, "getTasksByUser").mockResolvedValue(
      rawDataFromDB
    );

    const result = await taskService.getTasks("my-user-id");


    expect(result[0].assignee).toBeNull();
  });
});
