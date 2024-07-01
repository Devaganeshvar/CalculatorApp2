const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors"); 
const bcrypt = require('bcrypt');
dotenv.config();
const adminRouter = require("./routes/Admin.js");
const router = require("./routes/user.js");
const app = express();
const cookieParser = require('cookie-parser');
const UserModel = require('./models/User.js')

app.use(cors({ origin: 'http://localhost:5173', credentials: true })); 
app.use(express.json());
app.use(cookieParser())
app.use('/auth', router);
app.use('/admin', adminRouter);

mongoose.connect('mongodb://127.0.0.1:27017/authentication', { 

}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

app.get('/getUsers', (req, res) => {
    UserModel.find()
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.post('/post', async (req, res) => {
    const { username, email, password, isAdmin } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({ username, email, password: hashedPassword, isAdmin });
        await newUser.save();
        
        res.json({ message: 'User added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add user' });
    }
});

app.put('/users/:id', async (req, res) => {
    const { username, email, isAdmin } = req.body;
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, { username, email, isAdmin }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
});

app.get('/out', (req, res) => {
    res.clearCookie('token')
    return res.json({status: true})
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
