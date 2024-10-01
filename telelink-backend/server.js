// Khai báo module express
const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const roleRoutes = require('./routes/roleRoutes.js');
const cors = require('cors');
const createError = require('http-errors');

// Thực thi cấu hièn ứng dụng sử dụng file .env
dotenv.config();
// Định nghĩa 1 webserver
const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
};

// Kích hoạt middleware cho phép Express đọc json từ body của request
app.use(express.json());
app.use(cors(corsOptions));
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/role', roleRoutes);

const port = process.env.PORT || 8080;

// Chỉ định middleware kiểm soát requests không hợp lệ
app.use(async(req, res, next)=>{
    next(createError.NotFound());   // Có thể bổ sung messsage trong hàm NotFound
})

app.use((err, req, res, next)=>{
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        }
    });
});


app.listen(port, () => {
    console.log(`Webserver is running at http://localhost:${port}`);
})