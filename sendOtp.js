require('dotenv').config();
const nodemailer = require('nodemailer');
const mysql = require('mysql2');

// Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// SMTP Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP Email Function
const sendOTP = (email, callback) => {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes expiry

  // Store OTP in Database
  db.query(
    'INSERT INTO otp_codes (email, otp, expires_at) VALUES (?, ?, ?)',
    [email, otp, expiresAt],
    (err, results) => {
      if (err) return callback(err);

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It is valid for 5 minutes.`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) return callback(error);
        callback(null, 'OTP Sent Successfully!');
      });
    }
  );
};

module.exports = sendOTP;
