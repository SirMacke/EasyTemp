const path = require('path');
const mongoose = require('mongoose');
const validate = require('../middleware/validate.js');
const express = require('express');
const { DataPack, validateDataPack } = require('../models/dataPack');
const router = express.Router();

// Om någon vill se rummet hallen https://easytemp.herokuapp.com/room/3
router.get('/:id', async(req, res) => {
    // deklarera några variabler
    const date = new Date();
    const query = { arduinoId: 1, temperature: 1, humidity: 1, date: 1, _id: 0 };
    const sort = { date: 1 };

    // Tar fram datumet och tiden för en timme sedan
    const hourdifferent = date.getHours() - 1;
    const hourComparerDate = new Date();
    hourComparerDate.setHours(hourdifferent);

    // Tar fram datumet och tiden för ett dygn sedan
    const daydifferent = date.getDate() - 1;
    const dayComparerDate = new Date();
    dayComparerDate.setDate(daydifferent);

    // Tar fram datumet och tiden för en vecka sedan
    const weekdifferent = date.getDate() - 7;
    const weekComparerDate = new Date();
    weekComparerDate.setDate(weekdifferent);

    // Hämtar all data från senaste timmen
    const hourDataPack = await DataPack.find({ arduinoId: req.params.id, date: { $gte: hourComparerDate } }, query).sort(sort);
    if (!hourDataPack) return res.status(404).send('The hourDataPack was not found.');

    // Hämtar all data från senaste dygnet
    const dayDataPack = await DataPack.find({ arduinoId: req.params.id, date: { $gte: dayComparerDate } }, query).sort(sort);
    if (!dayDataPack) return res.status(404).send('The dayDataPack was not found.');

    // Hämtar all data från senaste veckan
    const weekDataPack = await DataPack.find({ arduinoId: req.params.id, date: { $gte: weekComparerDate } }, query).sort(sort);
    if (!weekDataPack) return res.status(404).send('The weekDataPack was not found.');

    function collectClientData(type) {
        var result = [
            [],
            []
        ];
        if (type == 'hour') {
            for (let i = 0; i < hourDataPack.length; i += Math.floor(hourDataPack.length / 50)) {
                result[0].push(hourDataPack[i].temperature);
                result[1].push(hourDataPack[i].humidity);
            }
        }
        if (type == 'day') {
            for (let i = 0; i < dayDataPack.length; i += Math.floor(dayDataPack.length / 200)) {
                result[0].push(dayDataPack[i].temperature);
                result[1].push(dayDataPack[i].humidity);
            }
        }
        if (type == 'week') {
            for (let i = 0; i < weekDataPack.length; i += Math.floor(weekDataPack.length / 200)) {
                result[0].push(weekDataPack[i].temperature);
                result[1].push(weekDataPack[i].humidity);
            }
        }

        return result;
    }

    // Sätter cookies i clientens webbläsare
    res.cookie('arduinoId', JSON.stringify(hourDataPack[0].arduinoId));
    res.cookie('hourDataPack', JSON.stringify(collectClientData('hour')));
    res.cookie('dayDataPack', JSON.stringify(collectClientData('day')));
    res.cookie('weekDataPack', JSON.stringify(collectClientData('week')));

    // Skickar html fil
    res.sendFile(path.join(__dirname, '../public/room', 'room.html'));
});

router.get('/:id/live', async(req, res) => {
    const date = new Date();
    const query = { arduinoId: 1, temperature: 1, humidity: 1, date: 1, _id: 0 };
    const sort = { date: 1 };

    const minutedifferent = date.getMinutes() - 1;
    const minuteComparerDate = new Date();
    minuteComparerDate.setMinutes(minutedifferent);

    const dataPack = await DataPack.find({ arduinoId: req.params.id, date: { $gte: minuteComparerDate } }, query).sort(sort);
    if (!dataPack) return res.status(404).send('The dataPack was not found.');

    var newData = dataPack[dataPack.length - 1];

    res.send(JSON.stringify(newData));
});

// När Arduinos skickar data
router.post('/', async(req, res) => {
    // sparar all data under en variabel
    let dataPack = new DataPack({
        arduinoId: req.body.arduinoId,
        temperature: req.body.temperature,
        humidity: req.body.humidity
    });

    // sparar data i databasen
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