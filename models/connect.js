/**
 * Created by Sega on 29/03/2017.
 */
'use strict';
const mongoose = require('mongoose');

const options = {
	user: "sega",
	pass: "sega4deptrai",
	auth: {
		authdb: 'admin'
	}
};
mongoose.connect('mongodb://45.77.36.109:27017/quickjobfind',{ useMongoClient: false, options });
module.exports = mongoose;