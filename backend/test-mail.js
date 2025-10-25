require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.ADMIN_EMAIL,
  subject: 'Test Email',
  text: 'This is a test email'
}, (err, info) => {
  if (err) console.log('Mail error:', err);
  else console.log('Mail sent:', info.response);
});
