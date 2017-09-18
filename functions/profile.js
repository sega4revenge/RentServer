'use strict';
const user = new require('../models/user');
const fun_product = require('./fun_product');
exports.getProfile = userid =>

    new Promise((resolve,reject) => {

        let ObjectId;
        ObjectId = require('mongodb').ObjectID;

        user.find({ _id: ObjectId(userid)})
            .exec(function (err, post) {
                if(err) throw err;
                console.log(post);


            })

            .then(users => {

					resolve(users[0]);
            }

            )
            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

    });

exports.getFullProfile = userid =>

	new Promise((resolve,reject) => {

		let ObjectId;
		ObjectId = require('mongodb').ObjectID;

		user.find({ _id: ObjectId(userid)})
			.populate({
				path: "listproduct",
				select: "-user -comment",
				options: {sort: {"time": -1}},
				// Get friends of friends - populate the 'friends' array for every friend
			})


			.then(users => {

				resolve({status: 201, user : users[0]});

				}

			)
			.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});
exports.editInfoUser = (userid,newname) =>

	new Promise((resolve,reject) => {

		let ObjectId;
		ObjectId = require('mongodb').ObjectID;

		user.findByIdAndUpdate(
			userid,
			{$set: {"name": newname}},
			{safe: true, upsert: true, new: true,select: "-listproduct"},
			function (err, model) {
				console.log(err);
				resolve({status: 200, user: model});
			}
		)


			.then(users => {

					resolve({status: 201, user : users[0]});

				}

			)
			.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});