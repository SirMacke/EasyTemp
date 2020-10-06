const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const home = require('../routes/home');
const room = require('../routes/room');
const error = require('../middleware/error');

module.exports = function(app) {
    app.use(express.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cookieParser());
    app.use('/', home);
    app.use('/room', room);
    app.use(error);
}