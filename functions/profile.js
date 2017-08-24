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

			.then(users => {
				console.log("fdhgjgkf");
				fun_product.allproductbyuser(userid)

					.then(result => {
						if(result.listproduct!==0){
							console.log("fdhf");
							users[0].listproduct = result.listproduct;
						}
						resolve({status: 201, user : users[0]});
					})
					.catch(() => resolve({status: 201, user : users[0]}));


				}

			)
			.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});