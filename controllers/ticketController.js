const express = require('express');
const { Sequelize } = require('sequelize');
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
    // res.send( { suat_chieu, chi_nhanh, phim });
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

    // Destructure the results 
    // Assuming the procedure returns [tickets, showtime, room]
    const [ve, phong] = results;

    // Send the response as JSON
    res.json({ ve,  phong });
  } catch (error) {
    console.error('Error fetching tickets and room:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const lockTicket = async (req, res) => {
  const { ma_ve, time } = req.params;

  try {
    const ve = await Ve.findOne({ where: { ma_ve } });

    if (!ve) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    let lockedUntil;
    if (time === '-1') {
      // Lock forever
      lockedUntil = new Date(9999, 11, 31); // Arbitrary far future date
    } else {
      const now = new Date();
      lockedUntil = new Date(now.getTime() + parseInt(time) * 60000); // Lock for specified minutes
    }

    ve.locked_until = lockedUntil;
    ve.trang_thai = 'lock';
    await ve.save();

    res.json({ message: 'Ticket locked', locked_until: lockedUntil });
  } catch (error) {
    console.error('Error locking ticket:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const unlockTicket = async (req, res) => {
  const { ma_ve } = req.params;

  try {
    const ve = await Ve.findOne({ where: { ma_ve } });

    if (!ve) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ve.trang_thai === 'mua') {
      return res.status(400).json({ message: 'Cannot unlock a purchased ticket' });
    }

    ve.locked_until = null;
    ve.locked_by = null;
    ve.trang_thai = 'chua_mua'; // Change status back to 'chua_mua'
    await ve.save();

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

    // Create a new transaction
    const transaction = await TongVe.create({
      gia_tong: totalPrice
    });

    // Update each ticket with the transaction ID and mark as sold
    await Ve.update(
      { ma_giao_dich: transaction.ma_giao_dich, trang_thai: 'mua' },
      {
        where: {
          ma_ve: {
            [Sequelize.Op.in]: ticketIdsArray
          }
        }
      }
    );

    res.json({ message: 'Payment completed successfully', ma_giao_dich: transaction.ma_giao_dich });
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