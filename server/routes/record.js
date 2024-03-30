const express = require('express');
const route = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { saveRecord, getReport } = require('../controllers/record');
const { body } = require('express-validator');

route.post('/saveRecord', fetchuser, [
    body('correctPosture', "correctPosture doesn't exist in the body").exists(),
    body('shakeTime', "shakeTime doesn't exist in the body").exists(),
    body('shakeOrientation', "shakeOrientation doesn't exist in the body").exists(),
    body('shakeCount', "shakeCount doesn't exist in the body").exists(),
    body('distance', "distance doesn't exist in the body").exists(),
    body('clickActivation', "clickActivation doesn't exist in the body").exists(),
    body('inhaleAngle', "inhaleAngle doesn't exist in the body").exists(),
    body('inhaleTime', "inhaleTime doesn't exist in the body").exists(),
    body('holdTime', "holdTime doesn't exist in the body").exists(),
], saveRecord)
route.get('/getReport', fetchuser, getReport);

module.exports = route;