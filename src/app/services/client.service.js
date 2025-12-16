const { Client } = require('../../models');
const AppError = require('../utils/AppError');

class ClientService {
  static async createClient(userId, name, email) {
    if (!userId || !name) {
      throw new AppError('Missing required fields', 400);
    }

    const existingClient = await Client.findOne({
      where: { user_id: userId, name },
    });

    if (existingClient) {
      throw new AppError('Client with this name already exists for the user', 409);
    }

    const client = await Client.create({ user_id: userId, name, email });
    return client;
  }

  static async listClients(userId) {
    const where = userId ? { user_id: userId } : undefined;
    const clients = await Client.findAll({
      where,
      order: [['created_at', 'DESC']],
    });
    return clients;
  }

  static async getClientById(id, userId) {
    const where = { id };
    if (userId) {
      where.user_id = userId;
    }

    const client = await Client.findOne({ where });
    if (!client) {
      throw new AppError('Client not found', 404);
    }
    return client;
  }

  static async deleteClient(id, userId) {
    const client = await this.getClientById(id, userId);
    await client.destroy();
    return;
  }
}

module.exports = ClientService;

