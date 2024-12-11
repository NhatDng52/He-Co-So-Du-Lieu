const { Sequelize } = require('sequelize');
const sql = require('../config/db');

const TicketProcedure = {
    getShowtimesBefore: async (days) => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days); // Calculate the target date
        
        const results = await sql.query('CALL GetShowtimesBefore(:targetDate)', {
          replacements: { targetDate: targetDate.toISOString().split('T')[0] },
          type: Sequelize.QueryTypes.RAW,
          raw: false,  // This might help preserve multiple result sets
        });
        return results; // `results` will now include all result sets
    },

  lockTicket: async (ma_ve, time) => {
    const [results] = await sequelize.query('CALL LockTicket(:ma_ve, :time)', {
      replacements: { ma_ve, time }
    });

    return results;
  },

  unlockTicket: async (ma_ve) => {
    const [results] = await sequelize.query('CALL UnlockTicket(:ma_ve)', {
      replacements: { ma_ve }
    });

    return results;
  },

  completePayment: async (ticketIds) => {
    const [results] = await sequelize.query('CALL CompletePayment(:ticketIds)', {
      replacements: { ticketIds: ticketIds.join(',') }
    });

    return results;
  }
};

module.exports = TicketProcedure;