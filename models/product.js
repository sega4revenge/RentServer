'use strict';


const mongoose = require("./connect");
const Schema = require("mongoose/lib/schema");


const productSchema = mongoose.Schema({
    user                : {type: Schema.Types.ObjectId, ref: 'user'},
    productname         : String,
    price               : String,
    number              : String,
    description         : String,
    category            : String,
    type                : String,
    time                : String,
    created_at          : String,
	statussave			: String,
	location: {
		type: { type: String, default:'Point' },
        address : {type : String },
		coordinates: { type: [Number], index: '2dsphere'}
	},
    view                : Number,
    images              : [String],
	comment             : [{type: Schema.Types.ObjectId, ref: 'comment'}]
});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('product', productSchema);