import { FriendshipService } from "../services/friendshipService.js";

const friendshipService = new FriendshipService();

export class FriendshipController {
  async send(req, res) {
    const senderId = req.userId;

    const { receiverId } = req.body;

    try {
      const result = await friendshipService.sendRequest(senderId, receiverId);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async accept(req, res) {
    const { id } = req.params;

    try {
      const result = await friendshipService.acceptRequest(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async pending(req, res) {
    const userId = req.userId;

    try {
      const requests = await friendshipService.getPending(userId);
      return res.status(200).json(requests);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro interno ao buscar convites.", detalhes: error.message} );
    }
  }

  async list(req, res) {
    const user = req.userId;
    try {
      const friendList = await friendshipService.getFriendsByUser(user);
      return res.status(200).json(friendList);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro interno ao buscar amizades.", detalhes: error.message} );
    }
  }
  async remove(req, res) {
    const userId = req.userId; 
    const { friendId } = req.params;

    try {
      const result = await friendshipService.removeConnection(userId, friendId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Erro interno ao desfazer amizade.", detalhes: error.message });
    }
  }
}
