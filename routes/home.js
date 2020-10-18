const path = require('path');
const mongoose = require('mongoose');
//const validate = require('../middleware/validate.js');
const { DataPack } = require('../models/dataPack');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home', 'home.html'));
});

router.get('/live', async(req, res) => {
    const date = new Date();
    const query = { arduinoId: 1, temperature: 1, humidity: 1, date: 1, _id: 0 };
    const sort = { date: 1 };

    const minutedifferent = date.getMinutes() - 1;
    const minuteComparerDate = new Date();
    minuteComparerDate.setMinutes(minutedifferent);

    const dataPack = await DataPack.find({ date: { $gte: minuteComparerDate } }, query).sort(sort);
    if (!dataPack) return res.status(404).send('The dataPack was not found.');

    const numberOfInputs = 4;
    var newData = [];

    for (let i = 1; i < numberOfInputs + 1; i++) {
        newData.push(dataPack[dataPack.length - i]);
    }

    res.send(JSON.stringify(newData));
});

module.exports = router;