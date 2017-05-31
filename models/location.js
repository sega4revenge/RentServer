'use strict';

const mongoose = require("./connect");

const Schema = mongoose.Schema;
const locationSchema = mongoose.Schema({

    idlocation             : String,
    macv            : { type: String, ref: 'tintuyendung' },
    longitude            : String,
    latitude    :String,

 
});
 
mongoose.Promise = global.Promise;

module.exports = mongoose.model('location', locationSchema);