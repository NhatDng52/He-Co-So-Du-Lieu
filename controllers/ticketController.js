const express = require('express');
const { Sequelize } = require('sequelize');
const SuatChieu = require('../models/showtime'); // Adjust the path as needed
const Phim = require('../models/film'); // Adjust the path as needed
const ChiNhanh = require('../models/branch')
const Ve = require('../models/ticket')
const Phong = require('../models/room')
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
    // res.json({phim, suat_chieu, chi_nhanh })
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
    console.log("done find ve");

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
    console.log("done find phong");

    // Send the response as JSON
    res.json({ve, phong});
  } catch (error) {
    console.error('Error fetching tickets and room:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const lockSeat = async (req, res) => {
  const { ma_ve } = req.params;

  try {
    const ve = await Ve.findOne({ where: { ma_ve } });

    if (!ve) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const now = new Date();
    const lockedUntil = new Date(now.getTime() + 5 * 60000); // 5 minutes from now

    ve.locked_until = lockedUntil;
    await ve.save();

    res.json({ message: 'Seat locked', locked_until: lockedUntil });
  } catch (error) {
    console.error('Error locking seat:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
// Add a new user
const createUser = async (req, res) => {
  const { name, email, age } = req.body;
  const user = new User({ name, email, age });
  try {
    await user.save();
    res.redirect('/users');
  } catch (err) {
    res.status(500).send('Error creating user');
  }
};

module.exports = {
  getTicketByShowtime,
  getShowtimesBefore,
  createUser
};