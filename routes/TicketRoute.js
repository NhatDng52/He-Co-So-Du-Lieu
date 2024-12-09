const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.get('/room/:ma_suat_chieu/:ma_chi_nhanh', ticketController.getTicketByShowtime);
router.post('/lock/:ma_ve/:time', ticketController.lockTicket);
router.post('/unlock/:ma_ve', ticketController.unlockTicket);
router.post('/complete-payment', ticketController.completePayment); // New route for payment
router.get('/', ticketController.getShowtimesBefore);

module.exports = router;