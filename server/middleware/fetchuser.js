const jwt = require('jsonwebtoken');
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {
    try {
        const token = req.header('authToken');
        if (!token) {
            return res.status(401).json({ success: false, msg: 'Please Enter a valid token' });
        } else {
            const data = jwt.verify(token, JWT_SECRET);
            req.user = data;
            next();
        }
    } catch (err) {
        console.error(err.message);
        return res.status(401).json({ success: false, msg: 'Please Enter a valid token' });
    }
}
module.exports = fetchuser;