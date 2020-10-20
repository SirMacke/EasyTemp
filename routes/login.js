const auth = require('../middleware/auth.js');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user.js');
const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/webpages/login', 'login.html'));    
});

router.post('/login', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ username: req.body.usernameOrEmail });
    if (!user) user = await User.findOne({ email: req.body.usernameOrEmail });
    if (!user) return res.status(400).send('Invalid username, email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid username, email or password.');

    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    res.cookie('auth', token);

    if (decoded.isAdmin) return res.redirect('/admin/home');

    res.redirect('/user/home');
});

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

module.exports = router;