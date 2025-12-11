const { Waitlist } = require('../../models');

class WaitlistService {
  static async getWaitlist() {
    const waitlist = await Waitlist.findAll({
      order: [['createdAt', 'DESC']],
      attributes: ['email', 'status', 'createdAt'],
    });
    // Format createdAt for each waitlist entry: "MMMM Do YYYY, h:mm:ss a"
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    function ordinal(n) {
      const s = ["th", "st", "nd", "rd"],
        v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
    const formattedWaitlist = waitlist.map(item => {
      const d = item.createdAt;
      const month = monthNames[d.getMonth()];
      const day = d.getDate();
      const year = d.getFullYear();

      // hours in 12-hour format
      let h = d.getHours();
      const a = h >= 12 ? 'pm' : 'am';
      h = h % 12 || 12;
      const pad = n => String(n).padStart(2, '0');
      const minutes = pad(d.getMinutes());
      const seconds = pad(d.getSeconds());

      return {
        ...item.get({ plain: true }),
        createdAt: `${month} ${ordinal(day)} ${year}, ${h}:${minutes}:${seconds} ${a}`
      };
    });
    return formattedWaitlist;
  }

  static async getCount() {
    const count = await Waitlist.count();
    return count;
  }

  static async join(email) {
    const [entry, created] = await Waitlist.findOrCreate({
      where: { email },
      defaults: { status: 'pending' },
    });

    return { entry, created };
  }
}

module.exports = WaitlistService;
