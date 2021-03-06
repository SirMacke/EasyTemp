const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

// Model av DataPack med olika värden och vad dem accepterar
const DataPack = mongoose.model('DataPack', new mongoose.Schema({
    arduinoId: {
        type: Number,
        required: true,
        min: 0
    },
    temperature: {
        type: Number,
        required: true,
    },
    humidity: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
}));

function validateDataPack(dataPack) {
    const schema = {
        arduinoId: Joi.number().min(0).required(),
        temperature: Joi.number().required(),
        humidity: Joi.number().required(),
        date: Joi.date()
    };

    return Joi.validate(dataPack, schema);
};

exports.DataPack = DataPack;
exports.validateDataPack = validateDataPack;