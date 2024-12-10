const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const TicketProcedure = {
    getShowtimesBefore: async (days) => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days); // Use +days to get future dates
    
        const results = await sequelize.query('CALL GetShowtimesBefore(:targetDate)', {
          replacements: { targetDate: targetDate.toISOString().split('T')[0] },
          type: Sequelize.QueryTypes.RAW
        });
    

    return results;
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