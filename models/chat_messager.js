'use strict';

const mongoose = require("./connect");
const Schema = require("mongoose/lib/schema");

const chatSchema = mongoose.Schema({
	roomid             : String,
	messages             : [{
		name: { type: String },
		message : {type : String },
		created_at        : String
	}]
});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('chat', userSchema);