require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { poolPromise } = require('./config/db');
const authRouter = require('./routes/auth');

console.log('Backend server starting...');

  // Khởi tạo app express 
const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());



// Route cho chức năng xác thực
app.use('/api/auth', authRouter);

// Chạy server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 