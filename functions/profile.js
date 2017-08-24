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
			.exec(function (err, post) {
				if(err) throw err;
				console.log(post);


			})

			.then(() => {
				fun_product.allproductbyuser(userid)

					.then(result => {
						console.log(result.listproduct);

						resolve({status: 201, user : user});
					})
					.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));


				}

			)
			.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});