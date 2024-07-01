const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const checkAdmin = require('../models/middleware ');
const adminRouter = express.Router();


adminRouter.post('/adminlogin', async (req, res) => {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ email }, process.env.KEY, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        return res.json({ status: true, message: 'Login successful' });
    } else {
        return res.json({ status: false, message: 'Invalid credentials' });
    }
});

adminRouter.get('/users', checkAdmin, async (req, res) => {
    const users = await User.find();
    res.json(users);
});



adminRouter.post('/users', checkAdmin, async (req, res) => {
    const { username, email, password, isAdmin } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword, isAdmin });
    await newUser.save();
    res.json({ message: 'User added successfully' });
});


adminRouter.put('/users/:id', checkAdmin, async (req, res) => {
    const { username, email, isAdmin } = req.body;
    await User.findByIdAndUpdate(req.params.id, { username, email, isAdmin });
    res.json({ message: 'User updated successfully' });
});


adminRouter.delete('/users/:id', checkAdmin, async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
});

module.exports = adminRouter;
