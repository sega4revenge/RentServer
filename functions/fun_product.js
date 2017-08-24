"use strict";

const product = new require("../models/product");
const comment = new require("../models/comment");
const ObjectId = require("mongodb").ObjectID;
const FCM = require("fcm-node");
const fcm = new FCM("AIzaSyDbZnEq9-lpTvAk41v_fSe_ijKRIIj6R6Y");
exports.allproduct = () =>

	new Promise((resolve, reject) => {
		const d = new Date();
		const timeStamp = d.getTime();
		console.log("TIMESTAMP: " + timeStamp);
		product.find({type: "1"}, {comment: 0})
			.populate("user")
			.then(products => {

				if (products.length === 0) {

					reject({status: 404, message: "Product Not Found !"});

				} else {

					return products;

				}
			})

			.then(product => {
				resolve({status: 200, listproduct: product});

			})

			.catch(err => reject({status: 500, message: "Internal Server Error !"}));

	});
exports.allproductbyuser = (userid) =>

	new Promise((resolve, reject) => {

		product.find({user: ObjectId(userid)}, {comment: 0, user: 0})

			.then(product => {
				resolve({listproduct: product});

			})

			.catch(err => reject({status: 500, message: "Internal Server Error !"}));

	});
exports.createproduct = (userid, prodctname, price, time, number, category, address, description, timestamp, type) =>

	new Promise((resolve, reject) => {

		let newproduct;

		console.log(type);
		if (type === 1) {
			console.log(price);
			newproduct = new product({
				user: userid,
				productname: prodctname,
				price: price,
				time: time,
				number: number,
				category: category,
				address: address,
				description: description,
				created_at: timestamp,
				view: 0,
				type: type
			});
		} else {
			console.log(price);
			newproduct = new product({
				user: userid,
				productname: prodctname,
				price: "",
				time: "",
				number: number,
				category: category,
				address: address,
				description: description,
				created_at: timestamp,
				type: type
			});
		}


		newproduct.save()


			.then(() => {
				newproduct.populate("user", "_id name email images", function (err) {
					resolve({status: 201, message: "product Registered Sucessfully !", product: newproduct});
				});
			})


			.catch(err => {

				if (err.code === 11000) {


					reject({status: 409, message: "product Already Registered !"});

				} else {
					reject({status: 500, message: "Internal Server Error !"});
					throw err;

				}
			});
	});
exports.push_messtotopic = (productid, msg, type) =>

	new Promise((resolve, reject) => {
		const m = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
			to: "/topics/" + productid,

			data: {
				message: msg,
				type: type
			}
		};
		console.log(msg);

		fcm.send(m, function (err, response) {
			if (err) {
				console.log(err);
				reject({status: 409, message: "MessToTopic Error !"});
			} else {
				console.log(response);
				resolve({status: 201, message: "MessToTopic Sucessfully !", response: response});

			}
		});


	});
exports.refreshcomment = (productid) =>
	new Promise((resolve, reject) => {


		comment.find({productid: ObjectId(productid)})
			.populate("user", "_id name photoprofile")
			.then(comments => {

				if (comments.length === 0) {

					reject({status: 404, message: "Product Not Found !"});

				} else {

					return comments;

				}
			})
			.then(comment => {

				resolve({comment: comment});

			})

			.catch(err => {

				if (err.code === 11000) {

					reject({status: 409, message: "Comment Already Registered !"});

				} else {
					reject({status: 500, message: "Internal Server Error2 !"});
					throw err;

				}
			});
	});
exports.deletecomment = (commentid, productid) =>

	new Promise((resolve, reject) => {

		product.findOneAndUpdate(productid, {$pull: {comment: commentid}}, function (err, data) {
			console.log(err);
		})


			.then(() => {
				comment.findByIdAndRemove(commentid);
				// comment.findByIdAndUpdate(
				// 	producid,
				// 	{$push: {"comment": newcomment._id}},
				// 	{safe: true, upsert: true, new: true},
				// 	function (err, model) {
				// 		console.log(err);
				// 	}
				// );
				this.refreshcomment(productid)

					.then(result => {

						resolve({status: 201, comment: result.comment});
					})
					.catch(err => res.status(err.status).json({message: err.message}));

				this.push_messtotopic(productid, "Ahihi", 1);


				// let ObjectId;
				// ObjectId = require("mongodb").ObjectID;
				// comment.find({productid: ObjectId(productid)})
				// 	.populate("user", "_id name photoprofile" )
				// 	.then(comments => {
				//
				// 		if (comments.length === 0) {
				//
				// 			reject({status: 404, message: "Product Not Found !"});
				//
				// 		} else {
				//
				// 			return comments;
				//
				// 		}
				// 	})
				// 	.then(comment => {
				//
				//
				//
				// 	});


			})

			.catch(err => {

				if (err.code === 11000) {

					reject({status: 409, message: "Comment Already Registered !"});

				} else {
					reject({status: 500, message: "Internal Server Error 1!"});
					throw err;

				}
			});
	});
exports.addcomment = (userid, productid, content, time) =>

	new Promise((resolve, reject) => {

		let newcomment;


		newcomment = new comment({
			user: userid,
			productid: productid,
			content: content,
			time: time
		});

		newcomment.save()


			.then(() => {
				product.findByIdAndUpdate(
					productid,
					{$push: {"comment": newcomment._id}},
					{safe: true, upsert: true, new: true},
					function (err, model) {
						console.log(err);
					}
				);
				this.refreshcomment(productid)

					.then(result => {

						resolve({status: 201, comment: result.comment});
					})
					.catch(err => res.status(err.status).json({message: err.message}));

				this.push_messtotopic(productid, "Ahihi", 1);


				// let ObjectId;
				// ObjectId = require("mongodb").ObjectID;
				// comment.find({productid: ObjectId(productid)})
				// 	.populate("user", "_id name photoprofile" )
				// 	.then(comments => {
				//
				// 		if (comments.length === 0) {
				//
				// 			reject({status: 404, message: "Product Not Found !"});
				//
				// 		} else {
				//
				// 			return comments;
				//
				// 		}
				// 	})
				// 	.then(comment => {
				//
				//
				//
				// 	});


			})

			.catch(err => {

				if (err.code === 11000) {

					reject({status: 409, message: "Comment Already Registered !"});

				} else {
					reject({status: 500, message: "Internal Server Error 1!"});
					throw err;

				}
			});
	});


exports.productdetail = (productid, userid) =>

	new Promise((resolve, reject) => {


		product.find({_id: ObjectId(productid)})
			.populate({
				path: "user comment",
				options: {sort: {"time": -1}},
				// Get friends of friends - populate the 'friends' array for every friend
				populate: {path: "user", select: "_id name photoprofile"}
			})

			.then(products => {
				if (products.length === 0) {

					reject({status: 404, message: "Product Not Found !"});

				} else {
					if (products[0].user._id.toString() === userid) {
					}
					else {
						product.findByIdAndUpdate(
							productid,
							{$set: {"view": products[0].view + 1}},
							{safe: true, upsert: true, new: true},
							function (err, model) {
								console.log(err);
							}
						);
					}
					return products[0];

				}
			})

			.then(product => {


				resolve({status: 200, product: product});

			})

			.catch(err => reject({status: 500, message: "Internal Server Error !"}));

	});

exports.allcomment = (productid) =>

	new Promise((resolve, reject) => {


		product.find({_id: ObjectId(productid)}, {comment: 1})
			.populate({
				path: "user comment",
				// Get friends of friends - populate the 'friends' array for every friend
				populate: {path: "user", select: "_id name photoprofile"}
			})
			.then(products => {

				if (products.length === 0) {

					reject({status: 404, message: "Product Not Found !"});

				} else {

					return products[0];

				}
			})

			.then(product => {


				resolve({status: 200, product: product});

			})

			.catch(err => reject({status: 500, message: "Internal Server Error !"}));

	});
exports.uploadproduct = (productid, image) =>

	new Promise((resolve, reject) => {

		console.log(productid);



		product.find({_id: ObjectId(productid)})
			.populate("user")
			.then(products => {

				if (products.length === 0) {

					reject({status: 404, message: "User Not Found !"});

				} else {

					return products[0];

				}
			})

			.then(product => {
				product.images.push(image);
				product.save();
			})
			.catch(err => reject({status: 500, message: "Internal Server Error !"}));

	});