const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db')
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        message: message
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});   