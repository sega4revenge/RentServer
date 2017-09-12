'use strict';

const product = new require('../models/product');
const bcrypt = new require('bcryptjs');

exports.mSearch2 = (location, category,typeArrange) =>

	new Promise((resolve,reject) => {
	//	let arrImgDel = location.split(" , ");
	//	let dn = arrImgDel[0];
	//	let hcm = arrImgDel[1];
		var ids = new Array(location[0],location[1]);

		product.find( {address: {$in: [location[0],location[1]] }})

			.then(products => {
				console.log("products = " +  location[0] + location[1]);
				if (products.length === 0) {
					reject({status: 404, message: "Product Not Found !"});

				} else {
					console.log("products = " + products);
					return products;

				}
			})
			.then(product => {
				resolve({status: 200, listproduct: product});

			})
			.catch(err => reject({status: 500, message: "Internal Server Error !"}));
	});

exports.mSearch = (searchkey,location, category,typeArrange) =>

	new Promise((resolve,reject) => {
		var regex = new RegExp(searchkey.toLowerCase(), "i")
		if(typeArrange===0)
		{
			//console.log("products = " + regex);
			product.find( {productname: {  $regex :   regex   }, address : { $regex: location },category: { $regex: category } } ,{comment: 0}).sort({view: -1})
				.populate("user")
				.then(products => {

					if (products.length === 0) {
						reject({status: 404, message: "Product Not Found !"});

					} else {
						console.log("products = " + products);
						return products;

					}
				})
				.then(product => {
					resolve({status: 200, listproduct: product});

				})
				.catch(err => reject({status: 500, message: "Internal Server Error !"}));
		}
		if(typeArrange==1)
		{
			product.find( {productname: {  $regex :  regex  }, address : { $regex: location },category: { $regex: category } } ,{comment: 0} ).sort({created_at: -1})
				.populate("user")
				.then(products => {

					if (products.length === 0) {

						reject({status: 404, message: "Product Not Found !"});

					} else {
						console.log("products = " + products);
						return products;

					}
				})
				.then(product => {
					resolve({status: 200, listproduct: product});

				})
				.catch(err => reject({status: 500, message: "Internal Server Error !"}));
		}
		if(typeArrange==2)
		{
			product.find( {productname: {  $regex :  regex  }, address : { $regex: location },category: { $regex: category } } ,{comment: 0} ).sort({price: 1})
				.populate("user")
				.then(products => {

					if (products.length === 0) {
						console.log("products = " + products);
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
		if(typeArrange==3)
		{
			product.find( {productname: {  $regex :  regex  }, address : { $regex: location },category: { $regex: category } }  ,{comment: 0} ).sort({price: -1})
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

	});