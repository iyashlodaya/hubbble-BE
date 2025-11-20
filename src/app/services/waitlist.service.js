const { Waitlist } = require('../../models');

class WaitlistService {
  static async join(email) {
    const [entry, created] = await Waitlist.findOrCreate({
      where: { email },
      defaults: { status: 'pending' },
    });

    return { entry, created };
  }
}

module.exports = WaitlistService;
