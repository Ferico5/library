const express = require('express');
const { sendReminderEmail } = require('../controllers/EmailController');

const router = express.Router();

router.post('/send-reminder-email', sendReminderEmail);

module.exports = router;
