const { sql } = require('../config/db');

const TicketProcedure = {
    getShowtimesBefore: async (days) => {
        try {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + days); // Calculate the target date

            // Format the date as YYYY-MM-DD
            const formattedDate = targetDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'

            console.log(`EXEC GetShowtimesBefore @ngay_ket_thuc = '${formattedDate}'`);

            // Use the formatted date in the query
            const pool = await sql.connect();
            const result = await pool.request().query(`EXEC GetShowtimesBefore @ngay_ket_thuc = '${formattedDate}'`);
            console.log(result);
            return result.recordset;
        } catch (error) {
            console.error('Error in getShowtimesBefore:', error);
            throw error;
        }
    },

    getTicketsByShowtime: async (ma_suat_chieu, ma_chi_nhanh) => {
        try {
            console.log(`CALL GetTicketsByShowtime(${ma_suat_chieu}, ${ma_chi_nhanh})`);

            const [result] = await sql.query(`EXEC GetTicketsByShowtime @Ma_suat_chieu = ${ma_suat_chieu}, @Ma_chi_nhanh = ${ma_chi_nhanh}`);
            console.log(result);
            return result;
        } catch (error) {
            console.error('Error in getTicketsByShowtime:', error);
            throw error;
        }
    },

    lockTicket: async (ma_ve, time) => {
        try {
            console.log(`CALL LockTicket(${ma_ve}, ${time})`);

            const [result] = await sql.query(`EXEC LockTicket @Ma_ve = ${ma_ve}, @Time = ${time}`);
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

    completePayment: async (ticketIds) => {
        try {
            const ticketIdsParam = ticketIds.join(',');
            console.log(`CALL CompletePayment(${ticketIdsParam})`);

            const [results] = await sql.query(`EXEC CompletePayment @ticketIds = '${ticketIdsParam}'`);
            return results;
        } catch (error) {
            console.error('Error in completePayment:', error);
            throw error;
        }
    },

    createTransaction: async (totalPrice) => {
        try {
            const ma_so_nguoi = Math.floor(Math.random() * 100) + 1; // Generate a random integer between 1 and 100
            console.log(`CALL CreateTransaction(${totalPrice}, ${ma_so_nguoi})`);

            const [result] = await sql.query(`EXEC CreateTransaction @TotalPrice = ${totalPrice}, @Ma_so_nguoi = ${ma_so_nguoi}`);
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
                console.log(`CALL UpdateTicketsWithTransaction(${ticketId}, ${transactionId})`);
                await sql.query(`EXEC UpdateTicketsWithTransaction @TicketId = ${ticketId}, @TransactionId = ${transactionId}`);
            }
            console.log('All tickets updated with transaction ID');
        } catch (error) {
            console.error('Error in updateTicketsWithTransaction:', error);
            throw error;
        }
    }
};

module.exports = TicketProcedure;
