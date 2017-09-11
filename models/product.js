'use strict';


const mongoose = require("./connect");
const Schema = require("mongoose/lib/schema");


const productSchema = mongoose.Schema({
    user                : {type: Schema.Types.ObjectId, ref: 'user'},
    productname         : String,
    price               : String,
    number              : String,
    location            : String,
    description         : String,
    category            : String,
    address             : String,
    type                : String,
    time                : String,
    created_at          : String,
    lat                 : String,
    lot                 : String,
    view                : Number,
    images              : [String],
	comment             : [{type: Schema.Types.ObjectId, ref: 'comment'}]
});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('product', productSchema);