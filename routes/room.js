const path = require('path');
//const mongoose = require('mongoose');
//const validate = require('../middleware/validate.js');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/room', 'room.html'));
});

module.exports = router;