const express = require('express');
const route = express.Router();
const { signup, login } = require('../controllers/auth');
const { body } = require('express-validator');

route.post('/signup', [
    body('name', 'Length Of Name Should Be Minimum 3').isLength({ min: 3 }),
    body('email', 'Please Enter a valid email').isEmail(),
    body('password', 'password must be of minimum length 8').isLength({ min: 8 })
], signup);
route.post('/login', [
    body('email', 'Please Enter a valid email').isEmail(),
    body('password', 'Password Cannot Be Blank').isLength({ min: 1 })
], login);

module.exports = route;