require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const signup = async (req, res) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ success: false, err: err.array() });
        }
        const { email, password, name, dob, emergencyContact } = req.body;
        let user = await prisma.user.findFirst({
            where: {
                email
            }
        });
        console.log(user);
        if (user) {
            return res.status(400).json([{ msg: "User Already Exist With The Given Email,Please Login" }])
        }
        const salt = await bcryptjs.genSalt(10);
        const encrpytPass = await bcryptjs.hash(password, salt);

        user = await prisma.user.create({
            data: {
                email,
                password: encrpytPass,
                name,
                emergencyContact,
                dob
            }
        })
        const data = {
            email
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ success: true, msg: 'Sign Up Successfully!!!', authToken });//returning the user token to the user
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ success: false, msg: "Internal Server Error", err: err.msg });
    }
}
const login = async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({ success: false, err: err.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await prisma.user.findFirst({
            where: {
                email
            }
        });
        if (!user) {
            return res.status(400).json({ success: false, msg: "User Not Exist,Please Signup" });
        } else {
            const comparePass = await bcryptjs.compare(password, user.password);
            if (!comparePass) {
                return res.status(400).json({ success: false, msg: "Please Enter a Correct Email/Password" });
            } else {
                const data = {
                    id: user.id
                }
                const authToken = jwt.sign(data, JWT_SECRET);
                return res.json({ success: true, msg: "Login Successfully!!!", authToken });
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ success: false, msg: "Internal Server Error", err: err.msg });
    }
}

module.exports = { signup, login };

/*
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZW1haWwuY29tIiwiaWF0IjoxNzExNzg0MTAzfQ.dpc3wMY3kMJjKmGCMv5WNt60Tmq0vK7XRDO8LzjyVvs"
*/