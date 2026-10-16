const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db')
const userRoute = require('./routes/userRoute');

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});   