const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path')
const home = require('../routes/home');
const room = require('../routes/room');
const user = require('../routes/user');
const adminHome = require('../routes/admin/home');
const userHome = require('../routes/user/home');
const error = require('../middleware/error');

module.exports = function(app) {
    app.use(express.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '../') + 'public/home'));
    app.use(express.static(path.join(__dirname, '../') + 'public/room'));
    app.use(express.static(path.join(__dirname, '../') + 'public/login'));
    app.use(express.static(path.join(__dirname, '../') + 'public/signup'));
    app.use(express.static(path.join(__dirname, '../') + 'private/admin/home'));
    app.use(express.static(path.join(__dirname, '../') + 'private/user/home'));
    app.use(cookieParser());
    app.use('/', home);
    app.use('/room', room);
    app.use('/user', user);
    app.use('/admin/home', adminHome);
    app.use('/user/home', userHome);
    app.use(error);
}