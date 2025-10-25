// server.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('✅ Backend is running properly!');
});

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /book route
app.post('/book', upload.single('aadhaar'), async (req, res) => {
  try {
    const { name, service, hours, gender } = req.body;
    const aadhaarFile = req.file;

    if (!name || !service || !hours || !gender) {
      return res.status(400).json({ message: '❌ All fields are required.' });
    }

    if (!aadhaarFile) {
      return res.status(400).json({ message: '❌ Aadhaar file is required.' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Booking: ${name}`,
      text: `Name: ${name}\nService: ${service}\nHours: ${hours}\nGender: ${gender}\nAadhaar File: ${aadhaarFile.originalname}`,
      attachments: [{ filename: aadhaarFile.originalname, path: aadhaarFile.path }]
    };

    // Send email
    transporter.sendMail(mailOptions, (err, info) => {
      // Delete uploaded file regardless
      fs.unlink(aadhaarFile.path, (unlinkErr) => {
        if (unlinkErr) console.error('Failed to delete uploaded file:', unlinkErr);
      });

      if (err) {
        console.error('Mail error:', err);
        return res.status(500).json({ message: '❌ Failed to send email. Try again later.' });
      }

      return res.json({ message: '✅ Booking successful! Admin has been notified.' });
    });

  } catch (error) {
    console.error('Unexpected error in /book:', error);
    res.status(500).json({ message: '❌ Something went wrong. Try again later.' });
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
