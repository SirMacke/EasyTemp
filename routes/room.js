const path = require('path');
const mongoose = require('mongoose');
const validate = require('../middleware/validate.js');
const express = require('express');
const { DataPack, validateDataPack } = require('../models/dataPack');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/room', 'room.html'));
});

router.post('/', async(req, res) => {
    let dataPack = new DataPack({
        arduinoId: req.body.arduinoId,
        temperature: req.body.temperature,
        humidity: req.body.humidity
    });

    try {
        await dataPack.save();
        res.json({
            data: 'success'
        });
    } catch (ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
    }
});

module.exports = router;