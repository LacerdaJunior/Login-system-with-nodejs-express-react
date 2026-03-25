import { describe, it, expect, vi } from "vitest";
import { FriendshipService } from "../src/services/friendshipService.js";

vi.mock("../src/repositories/database-postg.js", () => {
  return {
    DatabasePostg: class {
      sendFriendRequest = vi.fn().mockResolvedValue();
      acceptFriendRequest = vi.fn().mockResolvedValue();
    },
  };
});

describe("FriendshipService - Regras de Negócio", () => {
  it("Não deve permitir que um usuário envie convite para si mesmo", async () => {
    const friendshipService = new FriendshipService();
    const meuId = "123";

    await expect(friendshipService.sendRequest(meuId, meuId)).rejects.toThrow(
      "Você não pode enviar um convite para si mesmo!"
    );
  });

  it("Deve enviar o convite com sucesso se os IDs forem diferentes", async () => {
    const friendshipService = new FriendshipService();
    const meuId = "123";
    const amigoId = "456";
    const resultado = await friendshipService.sendRequest(meuId, amigoId);

    expect(resultado).toEqual({ message: "Solicitação enviada com sucesso!" });
  });

  it("Deve aceitar o convite de amizade com sucesso", async () => {
    const friendshipService = new FriendshipService();
    const connectionId = "999-id-da-conexao";

    const resultado = await friendshipService.acceptRequest(connectionId);

    expect(resultado).toEqual({ message: "Convite de amizade aceito!" });
  });
});
