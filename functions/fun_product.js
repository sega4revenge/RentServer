"use strict";

const product = new require("../models/product");
const comment = new require("../models/comment");
const saveProduct = new require("../models/ProductSave");
const ObjectId = require("mongodb").ObjectID;
const FCM = require("fcm-node");
const fcm = new FCM("AIzaSyDbZnEq9-lpTvAk41v_fSe_ijKRIIj6R6Y");
exports.allproduct = (type, page,category) =>
	new Promise((resolve, reject) => {
		const d = new Date();
		const timeStamp = d.getTime();
		const limit = 10;
		if(page.is)
			if(page<1) page = 1;
		const start =  (limit * page) - limit;
		console.log("TIMESTAMP: " + timeStamp);


		if (type === 1) {
			if(category === 999 )
			{
				product.find({}, {comment: 0}).skip(start).limit(limit)
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
			}else{
				product.find({category: category}, {comment: 0}).skip(start).limit(limit)
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
			}

		} else {
			if(category === 999 ) {
				product.find({}, {comment: 0})
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
			}else{
				product.find({category: category}, {comment: 0})
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
			}
		}


	});
exports.allproductbyuser = (userid) =>

	new Promise((resolve, reject) => {

		product.find({user: ObjectId(userid)}, {comment: 0, user: 0})

			.then(product => {
				resolve({listproduct: product});

			})

			.catch(err => reject({status: 500, message: "Internal Server Error !"}));

	});

exports.EditProduct = (productid, productname, price, time, number, category, address, description, timestamp, listitem) =>

	new Promise((resolve, reject) => {

		product.find({_id: ObjectId(productid)})
			.then(products => {
				let productss = products[0];
				productss.productname = productname;
				productss.price = price;
				productss.time = time;
				productss.number = number;
				productss.category = category;
				productss.location.address = address;
				productss.description = description;
				productss.timestamp = timestamp;
				if (listitem.length !== 0) {
					for (var i = 0; i <= (listitem.length - 1); i++) {
						console.log(productid + "/" + listitem[i]);
						product.findOneAndUpdate({_id: ObjectId(productid)}, {$pull: {images: listitem[i]}})
							.then(() => {
								resolve({status: 200, message: "Delete Image Success"});
							})
							.catch(err => reject({status: 500, message: "Internal Server Error !"}));
					}
				}

				return productss.save();
			})
			.then(product => {
				resolve({status: 200, message: "Success"});
			})

			.catch(err => reject({status: 500, message: "Internal Server Error !"}));

	});
exports.createproduct = (userid, prodctname, price, time, number, category, address, description, lat, lot, timestamp, type) =>

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
				description: description,
				location: {
					type: 'Point',
					address : address,
					coordinates: [lot,lat]
				},
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

				description: description,
				location: {
					type: 'Point',
					address : address,
					coordinates: [lot,lat]
				},
				created_at: timestamp,
				view: 0,
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
exports.push_messtotopic = (productid, msg, userid) =>

	new Promise((resolve, reject) => {
		const m = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
			to: "/topics/" + productid,

			data: {
				productid: productid,
				useridproduct: msg,
				useridcmt: userid
			}
		};
		console.log("push mess: " + msg);

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

		comment.find({product: ObjectId(productid)})
			.populate("user product", "_id name photoprofile user")
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

exports.deleteProduct = (productid) =>

	new Promise((resolve, reject) => {

		comment.deleteMany({product: ObjectId(productid)})

			.then((comment) => {
				product.findByIdAndRemove(productid, function (err, offer) {
					if (err) {
						throw err;
					}
					resolve({status: 200, message: "IS !"});
				});

			})
			.catch(err => reject({status: 500, message: "Internal Server Error !"}));
	});
exports.mSaveProduct = (userid,productid) =>
	new Promise((resolve, reject) =>{

		saveProduct.find({"user": ObjectId(userid)})
			.populate({
				path: "product ProductSave",
				populate: {path: "ProductSave", select: "_id user productid"}
			})
			.then(sav => {
				console.log("run");
				if (sav.length === 0 ) {

					const saveProduct2 = new saveProduct({
						productid : productid,
						user : userid
					})
					saveProduct2.save();
					resolve({status: 201, message: "ok"});
				}else {
					console.log("run2222",sav.product);

				/*	saveProduct.find({"productid":ObjectId(productid)})
						.then(get =>{
							if (get.length === 0) {
								saveProduct.findByIdAndUpdate({user: ObjectId(userid)},
									{$push: {"productid":productid}},
									function (err, offer) {
										if (err) {
											throw err;
										}
									}
								);
								console.log("run3333");
								resolve({status: 201, message: "ok"});
							} else {
								saveProduct.findOneAndRemove({user: ObjectId(userid)},
									{$pull: {"productid": productid}},
									function (err, offer) {
										if (err) {
											throw err;
										}
									}
								);
								console.log("run444");
								resolve({status: 201, message: "ok"});
							}
						})
						.catch(err => reject({status: 500, message: "loi may chu noi bo"}));*/
				}

			})
			// .then(result => resolve({status: 201, message: "ok"})
			// )
			.catch(err => reject({status: 500, message: "loi may chu noi bo"}));
	});
exports.deletecomment = (commentid, productid) =>

	new Promise((resolve, reject) => {
		// console.log("cmtid:" + commentid + " productid: " + productid);
		product.findOneAndUpdate(productid, {$pull: {comment: commentid}})
			.then(() => {
				comment.findByIdAndRemove(commentid, function (err, offer) {
					if (err) {
						throw err;
					}
					module.exports.refreshcomment(productid)

						.then(result => {

							resolve({status: 201, comment: result.comment});
						})
						.catch(err => {
							if (err.code === 11000) {

								reject({status: 409, message: "Comment Already Registered !"});

							} else {
								reject({status: 500, message: "Internal Server Error 1!"});
								throw err;

							}
						});


					module.exports.push_messtotopic(productid, "Ahihi", 1);

				});
				console.log("fdhdfdj");


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


			});

	});
exports.addcomment = (userid, productid, content, time) =>

	new Promise((resolve, reject) => {

		let newcomment;


		newcomment = new comment({
			user: userid,
			product: productid,
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
						module.exports.push_messtotopic(productid, result.comment[0].product.user, userid);
						console.log("addcommnet : " + result.comment[0].product.user);
					})
					.catch(err => {
						if (err.code === 11000) {

							reject({status: 409, message: "Comment Already Registered !"});

						} else {
							reject({status: 500, message: "Internal Server Error 1!"});
							throw err;

						}
					});


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