const ClientService = require('../services/client.service');

class ClientController {
  static async createClient(request, reply) {
    try {
      const { name, email } = request.body;
      const userId = request.user?.id;
      const client = await ClientService.createClient(userId, name, email);
      return reply.code(201).send({
        message: 'Client created successfully',
        data: client,
      });
    } catch (error) {
      request.log.error({ err: error }, 'Failed to create client');
      const statusCode = error.statusCode || 500;
      return reply.code(statusCode).send({ message: error.message || 'Unable to create client' });
    }
  }

  static async listClients(request, reply) {
    try {
      const userId = request.user?.id;
      const clients = await ClientService.listClients(userId);
      return reply.code(200).send({
        message: 'Clients fetched successfully',
        data: clients,
      });
    } catch (error) {
      request.log.error({ err: error }, 'Failed to fetch clients');
      const statusCode = error.statusCode || 500;
      return reply.code(statusCode).send({ message: error.message || 'Unable to fetch clients' });
    }
  }

  static async getClientById(request, reply) {
    try {
      const { id } = request.params;
      const userId = request.user?.id;
      const client = await ClientService.getClientById(id, userId);
      return reply.code(200).send({
        message: 'Client fetched successfully',
        data: client,
      });
    } catch (error) {
      request.log.error({ err: error }, 'Failed to fetch client');
      const statusCode = error.statusCode || 500;
      return reply.code(statusCode).send({ message: error.message || 'Unable to fetch client' });
    }
  }

  static async deleteClient(request, reply) {
    try {
      const { id } = request.params;
      const userId = request.user?.id;
      await ClientService.deleteClient(id, userId);
      return reply.code(204).send();
    } catch (error) {
      request.log.error({ err: error }, 'Failed to delete client');
      const statusCode = error.statusCode || 500;
      return reply.code(statusCode).send({ message: error.message || 'Unable to delete client' });
    }
  }
}

module.exports = ClientController;

