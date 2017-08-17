'use strict';

const product = new require('../models/product');
const bcrypt = new require('bcryptjs');

exports.mSearch = (searchkey,location, category,typeArrange) =>
	console.log("keysearch1 = " + searchkey);
	console.log("category1 = " + category);
	console.log("location1 = " + location);
	console.log("typeArrange1 = " + typeArrange);
	new Promise((resolve,reject) => {
		if(typeArrange==0)
		{
			product.find( {productname: {  $regex :  searchkey  }, address : { $regex: location },category: category } ).sort({created_at: -1})
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
		if(typeArrange==1)
		{
			product.find( {productname: {  $regex :  searchkey  }, address : { $regex: location },category: category } ).sort({created_at: -1})
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
		if(typeArrange==2)
		{
			product.find( {productname: {  $regex :  searchkey  }, address : { $regex: location },category: category } ).sort({price: 1})
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
		if(typeArrange==3)
		{
			product.find( {productname: {  $regex :  searchkey  }, address : { $regex: location },category: category } ).sort({price: -1})
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