const auth = require('../middleware/auth.js');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validateUser} = require('../models/user.js');
const validate = require('../middleware/validate.js');
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login', 'login.html'));
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

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/signup', 'signup.html')); 
});

router.post('/signup', validate(validateUser), async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');
  
    user = new User(_.pick(req.body, ['username', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
  
    const token = user.generateAuthToken();
    res.cookie('auth', token);

    res.redirect('/admin/home');
});


router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user)
});

module.exports = router;