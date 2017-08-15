'use strict';


const mongoose = require("./connect");
const Schema = require("mongoose/lib/schema");


const commentSchema = mongoose.Schema({
    user            : {type: Schema.Types.ObjectId, ref: 'user'},
    productid           : {type: Schema.Types.ObjectId, ref: 'product'},
    content             : String,
    time                : String
});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('comment', commentSchema);