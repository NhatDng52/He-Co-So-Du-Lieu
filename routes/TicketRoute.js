const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.get('/', ticketController.getShowtimesBefore);
router.post('/add', ticketController.createUser);
router.get('/tickets/room/:ma_suat_chieu/:ma_chi_nhanh', ticketController.getTicketByShowtime);
module.exports = router;