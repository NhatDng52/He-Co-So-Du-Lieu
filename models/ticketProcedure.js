const { Sequelize } = require('sequelize');
const sql = require('../config/db');

const TicketProcedure = {
    getShowtimesBefore: async (days) => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days); // Calculate the target date
        
        // Format the date as YYYY-MM-DD
        const formattedDate = targetDate.toISOString().split('T')[0]; // '2024-12-11'

        console.log(`CALL GetShowtimesBefore '${formattedDate}'`); // Logs the correct query

        // Use the formatted date in the query
        const result = await sql.execute(`CALL GetShowtimesBefore('${formattedDate}')`);
        console.log(result)
        return result; // Results will include all result sets
    },

  
    getTicketsByShowtime: async (ma_suat_chieu, ma_chi_nhanh) => {
          console.log(`CALL GetTicketsByShowtime(${ma_suat_chieu}, ${ma_chi_nhanh})`);
  
          const result = await sql.execute(`CALL GetTicketsByShowtime(${ma_suat_chieu}, ${ma_chi_nhanh})`);
          console.log(result);
          return result; // Results will include all result sets
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