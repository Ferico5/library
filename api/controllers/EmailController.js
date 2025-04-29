require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const nodeMailer = require('nodemailer');

const sendReminderEmail = async (req, res) => {
  const { email, bookTitle } = req.body;

  const html = `
    <h1>📚 Reminder from Library</h1>
    <p>Your borrowed book <strong>${bookTitle}</strong> is overdue. Please return it ASAP!</p>
    <p>Regards,<br/>Library Team</p>
  `;

  try {
    const transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // to public, you can use ur own email
        pass: process.env.EMAIL_PASS // go to app password from google and change it with your
      },
    });

    const info = await transporter.sendMail({
      from: 'Library <library@gmail.com>',
      to: email,
      subject: '📬 Overdue Book Reminder',
      html,
    });

    console.log('Email sent:', info.messageId);
    res.status(200).json({ message: 'Reminder sent successfully!' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send reminder email.' });
  }
};

module.exports = { sendReminderEmail };
