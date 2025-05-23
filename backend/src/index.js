require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { poolPromise } = require('./config/db');
const authRouter = require('./routes/auth');

  // Khởi tạo app express
const app = express();
app.use(cors());
app.use(express.json());



// Route cho chức năng xác thực

app.use('/api/auth', authRouter);

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 