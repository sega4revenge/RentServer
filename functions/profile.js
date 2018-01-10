'use strict';
const user = new require('../models/user');
const fun_product = require('./fun_product');


exports.getProfile = userid =>

    new Promise((resolve,reject) => {

        let ObjectId;
        ObjectId = require('mongodb').ObjectID;

        user.find({ _id: ObjectId(userid)},{listproduct: 0,listsavedproduct: 0})
            .exec(function (err, post) {
                if(err) throw err;
                console.log(post);


            })
            .then(users => {
            	if(users[0].referral === undefined)
            		console.log("yeah");
            	else
				{
					console.log("yeah2345");
				}

					resolve(users[0]);
            }

            )
            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

    });

exports.getFullProfile = userid =>

	new Promise((resolve,reject) => {

		let ObjectId;
		ObjectId = require('mongodb').ObjectID;

		user.find({ _id: ObjectId(userid)},{listproduct: 1 })
			.populate({
				path: "listproduct",
				select: "-comment",
				options: {sort: {"time": -1}},
				populate: {path: "user", select: "-listproduct -listsavedproduct"}
				// Get friends of friends - populate the 'friends' array for every friend
			})



			.then(users => {
				console.log(users[0]);
				resolve({status: 201, user : users[0]});

				}

			)
			.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});
exports.editInfoUser = (userid,newname,newphone) =>

	new Promise((resolve,reject) => {

		let ObjectId;
		ObjectId = require('mongodb').ObjectID;

		user.findByIdAndUpdate(
			userid,
			{$set: {"name": newname, "phone": newphone}},
			{safe: true, upsert: true, new: true,select: "-listproduct -listsavedproduct"},
			function (err, model) {
				console.log(err);
				resolve({status: 200, user: model});
			}
		)
	});
exports.editPhoneNumber = (userid,phone) =>

	new Promise((resolve,reject) => {

		let ObjectId;
		ObjectId = require('mongodb').ObjectID;

		user.findByIdAndUpdate(
			userid,
			{$set: {"phone": phone}},
			{safe: true, upsert: true, new: true,select: "-listproduct -listsavedproduct"},
			function (err, model) {
				console.log(err);
				resolve({status: 200, user: model});
			}
		)
	});