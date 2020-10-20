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

router.get('/sign-up', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/webpages/signup', 'signup.html')); 
});

router.post('/sign-up', validate(validateUser), async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');
  
    user = new User(_.pick(req.body, ['username', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
  
    const token = user.generateAuthToken();
    res.cookie('auth', token);

    res.redirect('/user/home');
});

module.exports = router;