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
    lockTicket: async (ma_ve, time) => {
      console.log(`CALL LockTicket(${ma_ve}, ${time})`);

      const result = await sql.execute(`CALL LockTicket(${ma_ve}, ${time})`);
      console.log(result);
      return result;
  },
  unlockTicket: async (ma_ve) => {
     await sql.execute(`CALL unLockTicket(${ma_ve})`);
    return ;
  },

  completePayment: async (ticketIds) => {
    const [results] = await sequelize.query('CALL CompletePayment(:ticketIds)', {
      replacements: { ticketIds: ticketIds.join(',') }
    });

    return results;
  },
  createTransaction: async (totalPrice) => {
    const ma_so_nguoi = Math.floor(Math.random() * 100) + 1; // Generate a random integer between 1 and 100
    console.log(`CALL CreateTransaction(${totalPrice}, ${ma_so_nguoi})`);

    const result = await sql.execute(`CALL CreateTransaction(${totalPrice}, ${ma_so_nguoi})`);
    console.log(result);
    return result; // Return the transaction ID
  },

  updateTicketsWithTransaction: async (ticketIdsArray, transactionId) => {
    for (const ticketId of ticketIdsArray) {
      console.log(`CALL UpdateTicketsWithTransaction(${ticketId}, ${transactionId})`);
      await sql.execute(`CALL UpdateTicketsWithTransaction(${ticketId}, ${transactionId})`);
    }
    console.log('All tickets updated with transaction ID');
  }
};

module.exports = TicketProcedure;