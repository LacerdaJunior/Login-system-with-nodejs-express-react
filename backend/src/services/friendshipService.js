import { DatabasePostg } from "../repositories/database-postg.js";

const database = new DatabasePostg();

export class FriendshipService {
  async sendRequest(senderId, receiverId) {
    if (senderId === receiverId) {
      throw new Error("Você não pode enviar um convite para si mesmo!");
    }

    await database.sendFriendRequest(senderId, receiverId);
    return { message: "Solicitação enviada com sucesso!" };
  }

  async acceptRequest(connectionId) {
    await database.acceptFriendRequest(connectionId);

    return { message: "Convite de amizade aceito!" };
  }

  async getPending(userId) {
    const requests = await database.getPendingRequests(userId);
    return requests;
  }

  async getFriendsByUser(userId) {
    const friends = await database.getFriends(userId);
    return friends;
  }

  async removeConnection(userId, friendId) {
    await database.removeFriend(userId, friendId);

    return { message: "Amizade desfeita com sucesso." };
  }
}
