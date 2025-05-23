require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { poolPromise } = require('../config/db');

// Khởi tạo gửi mail bằng Gmail (dùng cho xác thực)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Đăng ký tài khoản
router.post('/register', async (req, res) => {
  const { username, email, password, roleID } = req.body;
  
  // Chuyển roleID sang số (phòng trường hợp nhập chuỗi)
  const role = parseInt(roleID);
  
  // Chỉ cho phép đăng ký role 2 hoặc 3
  if (!roleID || isNaN(role) || (role !== 2 && role !== 3)) {
    return res.status(400).json({ 
      message: 'roleID không hợp lệ! Chỉ cho phép role 2 (Job Seeker) hoặc 3 (Employer)' 
    });
  }

   // Mã hóa mật khẩu và tạo token xác thực
  const hashedPassword = await bcrypt.hash(password, 10);
  const verifyToken = crypto.randomBytes(32).toString('hex');

  try {
    const pool = await poolPromise;
    
    // Kiểm tra email đã tồn tại chưa
    const check = await pool.request()
      .input('email', email)
      .query('SELECT * FROM Accounts WHERE email = @email');
      
    if (check.recordset.length > 0) {
      return res.status(400).json({ message: 'Email đã tồn tại!' });
    }

    // Lưu user vào database
    await pool.request()
      .input('username', username || email.split('@')[0])
      .input('email', email)
      .input('password', hashedPassword)
      .input('isVerified', 0)
      .input('verifyToken', verifyToken)
      .input('roleID', role)
      .query(`INSERT INTO Accounts (username, email, password, isVerified, verifyToken, roleID) 
              VALUES (@username, @email, @password, @isVerified, @verifyToken, @roleID)`);

    // Gửi mail xác thực
    const verifyLink = `http://localhost:5000/api/auth/verify-email?token=${verifyToken}`;
    const mailOptions = {
      from: 'de180346tranvanphuc@gmail.com',
      to: email,
      subject: 'Xác thực tài khoản',
      text: `Nhấn vào link sau để xác thực tài khoản: ${verifyLink}`,
      html: `<p>Nhấn vào link sau để xác thực tài khoản:</p>
             <a href="${verifyLink}">${verifyLink}</a>`
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        // Lỗi gửi mail
        console.log('Lỗi gửi mail:', error);
        return res.status(500).json({ message: 'Gửi email thất bại!' });
      } else {
        // Gửi mail thành công
        console.log('Email sent: ' + info.response);
        return res.json({ message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.' });
      }
    });
    
  } catch (err) {
    // Lỗi server
    console.log(err);
    return res.status(500).json({ message: 'Lỗi server!' });
  }
});

// Route xác thực email
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('token', token)
      .query('SELECT * FROM Accounts WHERE verifyToken = @token');
      
    if (result.recordset.length === 0) {
      return res.status(400).send('Token không hợp lệ hoặc đã được xác thực!');
    }

    // Cập nhật trạng thái xác thực
    await pool.request()
      .input('accID', result.recordset[0].accID)
      .query('UPDATE Accounts SET isVerified = 1, verifyToken = NULL WHERE accID = @accID');
      
    res.send('Xác thực email thành công!');
  } catch (err) {
    console.log(err);
    res.status(500).send('Lỗi server!');
  }
});

module.exports = router;