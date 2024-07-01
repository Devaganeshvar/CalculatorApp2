const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User.js');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const crypto = require('crypto');
const checkAdmin = require('../models/middleware ');

// router.post('/signup', async (req, res) => { 
//     try {
//         const { username, email, password } = req.body;
//         const existingUser = await User.findOne({ email });
        
//         if (existingUser) {
//             return res.status(409).json({ message: "User already exists" });
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = new User({
//             username,
//             email,
//             password: hashedPassword,
//         });
        
//         await newUser.save();
        
//         return res.status(201).json({ status: true, message: "User registered" });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// });

const verificationCodes = new Map(); 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
       user: 'devaganeshvar@gmail.com',
       pass: 'utto qzpb fitn ylsk'
    }
});

router.post('/signup', async (req, res) => { 
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationCode = crypto.randomBytes(4).toString('hex'); 
        verificationCodes.set(email, { verificationCode, username, email, hashedPassword }); 

        const mailOptions = {
            from: 'devaganeshvar@gmail.com',
            to: email,
            subject: 'Email Verification',
            text: `Your verification code is ${verificationCode}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error("Error sending email: ", error);
                return res.status(500).json({ message: "Error sending verification email" });
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(201).json({ status: true, message: " Please check your email for the verification code." });
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/verify-email', async (req, res) => {
    const { email, code } = req.body;
    const storedData = verificationCodes.get(email);

    if (storedData && storedData.verificationCode === code) {
        const { username, email, hashedPassword } = storedData;
        verificationCodes.delete(email); 

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.json({ status: true, message: "Email verified successfully and user registered." });
    } else {
        res.status(400).json({ status: false, message: "Invalid verification code" });
    }
});


router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email})
    if(!user) {
        return res.json({message: "user is not registered"})
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword){
        return res.json({message : "password is incorrect"})
    }

    const token = jwt.sign({username: user.username}, process.env.KEY, {expiresIn: '1h'})
    res.cookie('token', token, {httpOnly: true,maxAge: 360000})
    return res.json({status: true,message: "login successfully"})
})
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "User not registered" });
        }

        const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: '50m' });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'devaganeshvar@gmail.com',
                pass: 'utto qzpb fitn ylsk'
            }
        });

        const mailOptions = {
            from: 'devaganeshvar@gmail.com',
            to: email,
            subject: 'Reset Password',
            text: `http://localhost:5173/resetPassword/${token}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error("Error sending email: ", error);
                return res.status(500).json({ message: "Error sending email" });
            } else {
                console.log('Email sent: ' + info.response);
                return res.json({ status: true, message: "Email sent" });
            }
        });

    } catch (err) {
        console.error("Server error: ", err);
        return res.status(500).json({ error: "An error occurred" });
    }
});

router.post('/resetPassword/:token', async (req, res) => {
    const token = req.params.token;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.KEY);
        const id = decoded.id;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate({ _id: id }, { password: hashedPassword });
        return res.json({ status: true, message: "Password updated" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
});

const verifyUser = (req, res, next) => {
    try{
    const token = req.cookies.token;
    if(!token) {
        return res.json({status: false, message: "no token"})
    }
    const decoded = jwt.verify(token, process.env.KEY);
    next()

    }catch(err) {
        return res.json(err)
    }
}

router.get('/verify',verifyUser, (req, res) => {
    return res.json({status: true, message: "authorized"})
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({status: true})
})

router.post('/send-calculation', async (req, res) => {
    const { email, result } = req.body;

    const mailOptions = {
        from: 'devaganeshvar@gmail.com',
        to: email,
        subject: 'Calculator Result',
        text: `The result of your calculation is: ${result}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error("Error sending email: ", error);
            return res.status(500).json({ message: "Error sending email" });
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ status: true, message: "Email sent successfully" });
        }
    });
});


router.post('/adminlogin', async (req, res) => {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ email }, process.env.KEY, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        return res.json({ status: true, message: 'Login successful' });
    } else {
        return res.json({ status: false, message: 'Invalid credentials' });
    }
});

router.get('usersData', checkAdmin, async (req, res) => {
   try{
    const allUser = await User.find();
    res.send({ status: "ok", data: allUser});
   }catch(error){
    console.log(error);
   }
});


router.post('/users', checkAdmin, async (req, res) => {
    const { username, email, password, isAdmin } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword, isAdmin });
    await newUser.save();
    res.json({ message: 'User added successfully' });
});


router.put('/users/:id', checkAdmin, async (req, res) => {
    const { username, email, isAdmin } = req.body;
    await User.findByIdAndUpdate(req.params.id, { username, email, isAdmin });
    res.json({ message: 'User updated successfully' });
});


router.delete('/users/:id', checkAdmin, async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
});

module.exports = router;
