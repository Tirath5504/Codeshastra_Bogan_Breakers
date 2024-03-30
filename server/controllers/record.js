const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { validationResult } = require('express-validator');

const saveRecord = async (req, res) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ success: false, err: err.array() });
        }
        const email = req.user.email;
        console.log(req.body);
        const record = await prisma.record.create({
            data: {
                email,
                time: (new Date(Date.now())),
                ...req.body
            }
        })
        res.json({ success: true, record });
    } catch (err) {
        res.json({ success: false, err });
    }
}
const getReport = (req, res) => {
    res.send('getReport');
}

module.exports = { saveRecord, getReport };