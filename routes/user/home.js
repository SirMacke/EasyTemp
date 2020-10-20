const auth = require('../../middleware/auth.js');
const { DataPack } = require('../../models/dataPack');
const { User } = require('../../models/user');
const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/', auth, async(req, res) => {
    var result = [];

    const date = new Date();

    const daydifferent = date.getDate() - 1;
    const dayComparerDate = new Date();
    dayComparerDate.setDate(daydifferent);

    const dataPack = await DataPack.find({ date: { $gte: dayComparerDate } }, { _id: 1 });
    if (!dataPack) return res.status(404).send('No dataPack was not found.');

    const users = await User.find({ isAdmin: false }, { username: 1 });
    if (!users) return res.status(404).send('No users were found.');

    const admins = await User.find({ isAdmin: true }, { username: 1 });
    if (!admins) return res.status(404).send('No admins were found.');

    result.push(dataPack.length);
    result.push(users.length);
    result.push(admins.length);

    res.cookie('statistics', JSON.stringify(result));

    res.sendFile(path.join(__dirname, '../../private/user/home', 'userHome.html'));
});

module.exports = router;