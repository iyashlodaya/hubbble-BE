const WaitlistService = require('../services/waitlist.service');

class WaitlistController {
  static async join(request, reply) {
    try {
      const { email } = request.body;
      const { entry, created } = await WaitlistService.join(email);
      const responseData = entry.toJSON();

      if (!created) {
        return reply.code(200).send({
          message: 'Email already exists in waitlist',
        });
      }

      return reply.code(201).send({
        message: 'Successfully joined waitlist',
        data: responseData,
      });
    } catch (error) {
      request.log.error({ err: error }, 'Failed to join waitlist');
      return reply.code(500).send({ message: 'Unable to join waitlist right now' });
    }
  }

  static async getWaitlist(request, reply) {
    try {
      const waitlist = await WaitlistService.getWaitlist();
      return reply.code(200).send({ message: 'Waitlist fetched successfully', data: waitlist });
    } catch (error) {
      request.log.error({ err: error }, 'Failed to get waitlist');
      return reply.code(500).send({ message: 'Unable to get waitlist right now' });
    }
  }

  static async getCount(request, reply) {
    try {
      const count = await WaitlistService.getCount();
      return reply.code(200).send({ data: { count } });
    } catch (error) {
      request.log.error({ err: error }, 'Failed to get count');
      return reply.code(500).send({ message: 'Unable to get count right now' });
    }
  }
}

module.exports = WaitlistController;
