const express = require('express');
const { Sequelize } = require('sequelize');
const SuatChieu = require('../models/showtime'); // Adjust the path as needed
const Phim = require('../models/film'); // Adjust the path as needed
const ChiNhanh = require('../models/branch');
const Ve = require('../models/ticket');
const Phong = require('../models/room');
const TongVe = require('../models/sumTicket'); // Adjust the path as needed

// GET request handler to get showtimes before now minus x days and render the page
const getShowtimesBefore = async (req, res) => {
  const days = 7; // Define the number of days here
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - days);

  try {
    // Fetch showtimes before the target date
    const suat_chieu = await SuatChieu.findAll({
      where: {
        ngay_thang: {
          [Sequelize.Op.lt]: targetDate
        }
      }
    });

    // Extract filmIds from the fetched showtimes
    const ma_phim = suat_chieu.map(suat_chieu => suat_chieu.ma_phim);
    const ma_chi_nhanh = suat_chieu.map(suat => suat.ma_chi_nhanh);
    // Fetch films that have filmIds in the extracted list
    const phim = await Phim.findAll({
      where: {
        ma_phim: {
          [Sequelize.Op.in]: ma_phim
        }
      }
    });
    const chi_nhanh = await ChiNhanh.findAll({
      where: {
        ma_chi_nhanh: {
          [Sequelize.Op.in]: ma_chi_nhanh
        }
      }
    });
    // Render the index.ejs template with films and showtimes
    res.render('index', { phim, suat_chieu, chi_nhanh });
  } catch (error) {
    console.error('Error fetching showtimes and films:', error);
    res.status(500).send('Internal Server Error');
  }
};

const getTicketByShowtime = async (req, res) => {
  const { ma_suat_chieu, ma_chi_nhanh } = req.params;

  try {
    // Fetch tickets that have not been bought for the specified showtime
    const ve = await Ve.findAll({
      where: {
        ma_suat_chieu: ma_suat_chieu,
        // You might want to add a condition to only get unsold tickets
        // trang_thai: 'chua_ban' // Assuming there's a status column for tickets
      }
    });

    // Fetch the showtime to get the so_phong value
    const suatChieu = await SuatChieu.findOne({
      where: {
        ma_suat_chieu: ma_suat_chieu
      }
    });

    if (!suatChieu) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    const so_phong = suatChieu.so_phong;

    // Fetch room that belongs to the specified showtime and branch
    const phong = await Phong.findOne({
      where: {
        ma_chi_nhanh: ma_chi_nhanh,
        so_phong: so_phong
      }
    });

    // Send the response as JSON
    res.json({ ve, phong });
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
    ve.trang_thai = 'lock'; // Change status to lock
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
    ve.trang_thai = 'chua_mua'; // Change status back to available
    await ve.save();

    res.json({ message: 'Ticket unlocked' });
  } catch (error) {
    console.error('Error unlocking ticket:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const completePayment = async (req, res) => {
  const { ticketIds } = req.body;

  if (!Array.isArray(ticketIds) || ticketIds.length === 0) {
    return res.status(400).json({ message: 'Invalid ticket IDs' });
  }

  try {
    // Calculate the total price
    const totalPrice = ticketIds.length * 100000; // Assuming each ticket costs 100,000 VND

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
            [Sequelize.Op.in]: ticketIds
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