const { sql } = require('../config/db');

const TicketProcedure = {
    getShowtimesBefore: async (days) => {
        try {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + days); // Calculate the target date

            // Format the date as YYYY-MM-DD
            const formattedDate = targetDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'

            console.log(`EXEC GetShowtimesBefore '${formattedDate}'`);

            // Use the formatted date in the query
            // const pool = await sql.connect();
            const result = await sql.query(`EXEC GetShowtimesBefore '${formattedDate}'`);
            console.log(result);
            return result.recordsets;
        } catch (error) {
            console.error('Error in getShowtimesBefore:', error);
            throw error;
        }
    },

    getTicketsByShowtime: async (ma_suat_chieu, ma_chi_nhanh) => {
        try {
            console.log(`EXEC GetTicketsByShowtime ${ma_suat_chieu},${ma_chi_nhanh}`);

            const result = await sql.query(`EXEC GetTicketsByShowtime ${ma_suat_chieu},${ma_chi_nhanh}`);
            // console.log(result);
            return result.recordsets;
        } catch (error) {
            console.error('Error in getTicketsByShowtime:', error);
            throw error;
        }
    },

    lockTicket: async (ma_ve, time) => {
        try {
            console.log(`EXEC LockTicket ${ma_ve}, ${time}`);

            const result = await sql.query`EXEC LockTicket ${ma_ve},${time}`;
            console.log(result);
            return result;
        } catch (error) {
            console.error('Error in lockTicket:', error);
            throw error;
        }
    },

    unlockTicket: async (ma_ve) => {
        try {
            console.log(`CALL UnlockTicket(${ma_ve})`);

            await sql.query(`EXEC UnlockTicket @Ma_ve = ${ma_ve}`);
        } catch (error) {
            console.error('Error in unlockTicket:', error);
            throw error;
        }
    },

    createTransaction: async (totalPrice) => {
        try {
            const ma_so_nguoi = Math.floor(Math.random() * 100) + 1; // Generate a random integer between 1 and 100
            console.log(`EXEC CreateTransaction  ${totalPrice},${ma_so_nguoi}`);

            const result = await sql.query(`EXEC CreateTransaction ${totalPrice}, ${ma_so_nguoi}`);
            console.log(result);
            return result; // Return the transaction ID
        } catch (error) {
            console.error('Error in createTransaction:', error);
            throw error;
        }
    },

    updateTicketsWithTransaction: async (ticketIdsArray, transactionId) => {
        try {
            for (const ticketId of ticketIdsArray) {
                console.log(`EXEC UpdateTicketsWithTransaction ${ticketId},${transactionId}`);
                await sql.query(`EXEC UpdateTicketsWithTransaction ${ticketId}, ${transactionId}`);
            }
            console.log('All tickets updated with transaction ID');
        } catch (error) {
            console.error('Error in updateTicketsWithTransaction:', error);
            throw error;
        }
    }
};

module.exports = TicketProcedure;
