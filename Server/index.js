const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors"); // Import the cors package
dotenv.config();
const router = require("./routes/user.js");
const app = express();
const cookieParser = require('cookie-parser');

app.use(cors({ origin: 'http://localhost:5173', credentials: true })); 
app.use(express.json());
app.use(cookieParser())
app.use('/auth', router);

mongoose.connect('mongodb://127.0.0.1:27017/authentication', { 

}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
