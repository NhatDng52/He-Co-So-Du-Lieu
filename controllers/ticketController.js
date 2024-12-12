const express = require('express');
const SuatChieu = require('../models/showtime'); // Adjust the path as needed
const Phim = require('../models/film'); // Adjust the path as needed
const ChiNhanh = require('../models/branch');
const Ve = require('../models/ticket');
const Phong = require('../models/room');
const TongVe = require('../models/sumTicket'); // Adjust the path as needed
const TicketProcedure = require('../models/ticketProcedure'); // Adjust the path as needed

// GET request handler to get showtimes before now minus x days and render the page
const getShowtimesBefore = async (req, res) => {
  const days = 7; // Define the number of days here

  try {
    const results = await TicketProcedure.getShowtimesBefore(days);
    
    // Extract the results into phim, suat_chieu, and chi_nhanh
    let [data,buffer] =results;
    const [phim, chi_nhanh, suat_chieu] = data;
    // res.send({ phim, suat_chieu, chi_nhanh });
    res.render('index', { phim, suat_chieu, chi_nhanh });
  } catch (error) {
    console.error('Error fetching showtimes and films:', error);
    res.status(500).send('Internal Server Error');
  }
};


const getTicketByShowtime = async (req, res) => {
  const { ma_suat_chieu, ma_chi_nhanh } = req.params;

  try {
    // Call the stored procedure through the TicketProcedure class
    const results = await TicketProcedure.getTicketsByShowtime(ma_suat_chieu, ma_chi_nhanh);
    let [data,buffer] =results;
    // Destructure the results 
    // Assuming the procedure returns [tickets, showtime, room]z
    const [ve, data_phong] = data;
    const phong =data_phong[0]
    res.json({ ve,  phong });
  } catch (error) {
    console.error('Error fetching tickets and room:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const lockTicket = async (req, res) => {
  const { ma_ve, time } = req.params;
  console.log('this is lock',{ ma_ve, time })
  try {
    // Call the stored procedure through TicketProcedure
    let results = await TicketProcedure.lockTicket(ma_ve, time);
    results =results[0][0][0]
    // Assuming the procedure returns a result indicating success
      res.json({ 
        message: 'Ticket locked', 
        locked_until: results.locked_until 
      });
  } catch (error) {
    console.error('Error locking ticket:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const unlockTicket = async (req, res) => {
  const { ma_ve } = req.params;
  try{
    await TicketProcedure.unlockTicket(ma_ve);
    res.json({ message: 'Ticket unlocked' });
  } catch (error) {
    console.error('Error unlocking ticket:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const completePayment = async (req, res) => {
  const { ticketIds } = req.params;
  const ticketIdsArray = ticketIds.split(',');
  console.log(ticketIdsArray)
  if (!Array.isArray(ticketIdsArray) || ticketIdsArray.length === 0) {
    return res.status(400).json({ message: 'Invalid ticket IDs' });
  }

  try {
    // Calculate the total price
    const totalPrice = ticketIdsArray.length * 100000; // Assuming each ticket costs 100,000 VND
    let ma_giao_dich = await TicketProcedure.createTransaction( totalPrice);
    ma_giao_dich = ma_giao_dich[0][0][0];
    console.log('ma giao dich la ',ma_giao_dich.ma_giao_dich)
    await TicketProcedure.updateTicketsWithTransaction(ticketIdsArray,ma_giao_dich.ma_giao_dich);
    // Create a new transaction
    res.json({ message: 'Payment completed successfully', ma_giao_dich: ma_giao_dich.ma_giao_dich });
  } catch (error) {
    console.error('Error completing payment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getTicketByShowtime,
  getShowtimesBefore,
  lockTicket,
  unlockTicket,
  completePayment
};