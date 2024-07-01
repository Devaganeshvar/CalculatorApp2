const jwt = require('jsonwebtoken');

const checkAdmin = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(403).send('Access denied.');

    try {
        const verified = jwt.verify(token, process.env.KEY);
        if (verified.email === process.env.ADMIN_EMAIL) {
            req.user = verified;
            next();
        } else {
            res.status(403).send('Access denied.');
        }
    } catch (err) {
        res.status(400).send('Invalid token.');
    }
};

module.exports = checkAdmin;
