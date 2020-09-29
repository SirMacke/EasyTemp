const path = require('path');
//const mongoose = require('mongoose');
//const validate = require('../middleware/validate.js');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home', 'home.html'));
});

/*router.post('/', validate(validateRequestGame), async (req, res) => {
    let requestGame = new RequestGame({
        name: req.body.name,
        email: req.body.email,
        game: req.body.game,
        info: req.body.info
    });
    
    try {
        const result = await requestGame.save();
    }
    catch (ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
    }
  
    res.send("Thanks for submitting a game request!");
});*/

module.exports = router;