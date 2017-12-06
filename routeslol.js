'use strict';




const jwt = require('jsonwebtoken');
const register = require('./functions/register');
const login = require('./functions/login');
const search = require('./functions/search');
const sms = require('./functions/speedsms');
const profile = require('./functions/profile');
const fun_product = require('./functions/fun_product');
const push_mess = require('./functions/push_mess');
const fs = require('fs'),
	url = require('url');
const password = require('./functions/password');
const config = require('./config/config.json');
const formidable = require('formidable');
const path = require('path');
const request = require("http").request;
const uploadDir = path.join('./uploads/');


module.exports = router => {

	router.get('/listchampion', function(req, res){

		request({
			method: "GET",
			url: "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/vn_VN/champion.json",
			json: true
		}, function(err, response, body) {
			console.log(err);
			res.json(body);
			var info = JSON.parse(body);
			console.log(info.articles);
		})

	});

};
