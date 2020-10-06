const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const home = require('../routes/home');
const room = require('../routes/room');
const user = require('../routes/user');
const error = require('../middleware/error');

module.exports = function(app) {
    app.use(express.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(express.static('public'));
    app.use(express.static('private'));
    app.use(cookieParser());
    app.use('/', home);
    app.use('/room', room);
    app.use('/user', user);
    app.use(error);
}