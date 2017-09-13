'use strict';

const mongoose = require("./connect");


const userSchema = mongoose.Schema({
    name             : String,
    email            : { type: String, unique: true },
    hashed_password    : String,
    created_at        : String,
    phone : String,
    photoprofile : String,
    tokenfirebase : String,
	temp_password : String,
	temp_password_time : String,
    status_code : String,
    facebook :{
        id : String,
        token : String,
        email: String,
        photoprofile    :String,
        name : String
    },
    google :{
        id : String,
        token : String,
        email: String,
        photoprofile    :String,
        name : String
    },
    listproduct : [{type: Schema.Types.ObjectId, ref: 'product'}]


});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('user', userSchema);