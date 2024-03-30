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
        const record = await prisma.record.create({
            data: {
                email,
                // time: (new Date(Date.now())),
                ...req.body
            }
        })
        res.json({ success: true, record });
    } catch (err) {
        res.json({ success: false, err });
    }
}
const getReport = async (req, res) => {
    try {

        const email = req.user.email;
        const records = await prisma.record.findMany({
            where: {
                email
            }
        })
        const data = {
            correctPosture: { correct: 0, incorrect: 0 },
            shakeOrientation: { correct: 0, incorrect: 0 },
            clickActivation: { correct: 0, incorrect: 0 },
            time: [],
            shakeTime: [],
            shakeCount: [],
            distance: [],
            inhaleAngle: [],
            inhaleTime: [],
            holdTime: [],
        }
        for (const record of records) {
            for (const key of Object.keys(record)) {
                if (key !== 'email') {
                    if (typeof (record[key]) === 'boolean') {
                        if (record[key])
                            data[key].correct++;
                        else
                            data[key].incorrect++;
                    } else {
                        if (key === 'time')
                            data[key].push((new Date(record[key])).toGMTString().slice(5, 12));
                        else
                            data[key].push(record[key]);
                    }
                }
            }
        }
        res.json({ success: true, data });
    } catch (err) {
        res.json({ success: false, err });
    }
}

module.exports = { saveRecord, getReport };
