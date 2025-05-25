require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { poolPromise } = require('../config/db');

// Bắt đầu gửi mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Đăng ký
router.post('/register', async (req, res) => {
  const { username, email, password, roleID } = req.body;
  
  // check độ dài mật khẩu
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự!' });
  }

  // check có ký tự đặc biệt
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharRegex.test(password)) {
    return res.status(400).json({ message: 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt!' });
  }

  // chuyển roleID sang số (phòng trường hợp nhập chuỗi)
  const role = parseInt(roleID);
  
  // chỉ cho phép đăng ký role 2 hoặc 3
  if (!roleID || isNaN(role) || (role !== 2 && role !== 3)) {
    return res.status(400).json({ 
      message: 'roleID không hợp lệ! Chỉ cho phép Job Seeker hoặc Employer' 
    });
  }

  // mã hóa mật khẩu và tạo token xác thực
  const hashedPassword = await bcrypt.hash(password, 10);
  const verifyToken = crypto.randomBytes(32).toString('hex');

  try {
    const pool = await poolPromise;
    
    // check email đã tồn tại chưa
    const check = await pool.request()
      .input('email', email)
      .query('SELECT * FROM Accounts WHERE email = @email');
    if (check.recordset.length > 0) {
      return res.status(400).json({ message: 'Email đã tồn tại!' });
    }

    // check username đã tồn tại chưa
    const checkUsername = await pool.request()
      .input('username', username || email.split('@')[0])
      .query('SELECT * FROM Accounts WHERE username = @username');
    if (checkUsername.recordset.length > 0) {
      return res.status(400).json({ message: 'Username đã tồn tại!' });
    }

    // lưu user vào database
    await pool.request()
      .input('username', username || email.split('@')[0])
      .input('email', email)
      .input('password', hashedPassword)
      .input('isVerified', 0)
      .input('verifyToken', verifyToken)
      .input('roleID', role)
      .query(`INSERT INTO Accounts (username, email, password, isVerified, verifyToken, roleID) 
              VALUES (@username, @email, @password, @isVerified, @verifyToken, @roleID)`);

    // gửi mail xác thực
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
        console.log('Lỗi gửi mail:', error);
        return res.status(500).json({ message: 'Gửi email thất bại!' });
      } else {
        console.log('Email sent: ' + info.response);
        return res.json({ message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.' });
      }
    });
    
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Lỗi server!' });
  }
});

// route xác thực email
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

    // cập nhật trạng thái xác thực
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