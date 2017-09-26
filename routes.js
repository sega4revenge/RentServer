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
const uploadDir = path.join('./uploads/');


module.exports = router => {

	router.get('/', (req, res) => {
		const query = url.parse(req.url, true).query;
		let pic;
		pic = query.image;

		//read the image using fs and send the image content back in the response
		fs.readFile('./uploads/' + pic, function (err, content) {
			if (err) {
				res.writeHead(400, {'Content-type': 'text/html'});
				console.log(err);
				res.end("No such image");
			} else {
				//specify the content type in the response will be an image
				res.writeHead(200, {'Content-type': 'image/jpg'});
				res.end(content);
			}
		});
	});
	router.get('/sendsms', (req, res) => {
		sms.sendsms("0906448076","abc","","",1)
	});
	/*	const keysearch = req.body.keysearch;
	const category = req.body.category;
	const location = req.body.location;
	const typeArrange = req.body.typeArrange;
	console.log("keysearch = " + keysearch);
	console.log("category = " + category);
	console.log("location = " + location);
	console.log("typeArrange = " + typeArrange);*/
	router.post('/search', (req, res) => {
		var keySearch = req.body.keysearch;
		var listaddress = req.body.location;
		var listcategory = req.body.category;
		var typeArrange = req.body.typeArrange;

		console.log(listaddress,listcategory,typeArrange);

		search.mSearch2(keySearch,listaddress,listcategory,typeArrange)
		//search.mSearch1(keysearch,location, category,typeArrange)
			.then(result => res.json(result))

			.catch(err => res.status(err.status).json({message: err.message}));

	});
	router.post('/searchmap', (req, res) =>{
		const lat = req.body.lat;
		var keySearch = req.body.keysearch;
		const lng = req.body.lng;
		const distance = req.body.distance;
		const listCategory = req.body.category;
		console.log(lat,lng,distance,listCategory);

		if(!lat || !lng)
		{
			res.status(400).json({message: 'Your Location Not Found!'});
		}else{
			fun_product.SearchMap(keySearch,lat,lng,distance,listCategory)
				.then(result => res.json(result))

				.catch(err => res.status(err.status).json({message: err.message}));
		}

	});
	router.post('/productdetail', (req, res) => {
		const productid = req.body.productid;
		const userid = req.body.userid;

		console.log(productid);
		if (!productid) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {
			fun_product.productdetail(productid,userid)
				.then(result => res.json(result))
				/*  .then(result => {

					  res.status(result.status).json({message: result.message, product: result.product})
				  })*/

				.catch(err => res.status(err.status).json({message: err.message}));
		}
	});
	router.post('/refreshcomment', (req, res) => {
		const productid = req.body.productid;

		console.log(productid);
		if (!productid) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {
			console.log(productid);
			fun_product.refreshcomment(productid)
				.then(result => res.json(result))
				/*  .then(result => {

					  res.status(result.status).json({message: result.message, product: result.product})
				  })*/

				.catch(err => res.status(err.status).json({message: err.message}));
		}
	});

	router.post('/getfullprofile', (req, res) => {
		const userid = req.body.userid;


		if (!userid) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			profile.getFullProfile(userid)
				.then(result => res.json(result))
				/*  .then(result => {

					  res.status(result.status).json({message: result.message, product: result.product})
				  })*/

				.catch(err => res.status(err.status).json({message: err.message}));
		}
	});
	router.post('/allcomment', (req, res) => {
		const productid = req.body.productid;

		console.log(productid);
		if (!productid) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {
			console.log(productid);
			fun_product.allcomment(productid)
				.then(result => res.json(result))
				/*  .then(result => {

					  res.status(result.status).json({message: result.message, product: result.product})
				  })*/
				.catch(err => res.status(err.status).json({message: err.message}));
		}
	});
	router.post('/authenticate', (req, res) => {


		const email = req.body.email;
		const password = req.body.password;
		const tokenfirebase = req.body.tokenfirebase;

		if (!email || !password || !tokenfirebase) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			login.loginUser(email, password, tokenfirebase)

				.then(result => {
					res.setHeader('Location', '/users/' + email);
					res.status(result.status).json({message: result.message, user: result.user});
					console.log(user)

				})

				.catch(err => res.status(err.status).json({message: err.message}));
		}
	});
	router.post('/getInbox', (req, res) => {

		const userid = req.body.userid;

		console.log(userid);
		if (!userid) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			fun_product.mInboxChat(userid)
				.then(result => res.json(result))

				.catch(err => res.status(err.status).json({message: err.message}));
		}

	});
	router.post('/allproduct', (req, res) => {

		const category = req.body.category;
		const type = req.body.type;
		const page = req.body.page;
		// const password = req.body.password;
		// const tokenfirebase = req.body.tokenfirebase;
		console.log(category,type,page);
		if (!type) {

		    res.status(400).json({message: 'Invalid Request !'});

		} else {

			fun_product.allproduct(type,page,category)
			// .then(result => res.json(result))

				.then(result => res.json(result))

				.catch(err => res.status(err.status).json({message: err.message}));
		}

	});
	router.post('/allproductsaved', (req, res) => {

		const userid = req.body.userid;
		const type = req.body.type;
		const page = req.body.page;
		// const password = req.body.password;
		// const tokenfirebase = req.body.tokenfirebase;
		if (!type) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			fun_product.allproductsaved(type,page,userid)
			// .then(result => res.json(result))

				.then(result => res.json({user: result.product}))

				.catch(err => res.status(err.status).json({message: err.message}));
		}

	});
	router.post('/users', (req, res) => {
		const id = req.body.token;
		const token = req.body.token;
		const name = req.body.name;
		const email = req.body.email;
		const password = req.body.password;
		const photoprofile = req.body.photoprofile;

		const type = req.body.type;
		const tokenfirebase = req.body.tokenfirebase;
		if (!name) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			register.registerUser(id, token, name, email, password, photoprofile, type, tokenfirebase)

				.then(result => {

					res.setHeader('Location', '/users/' + email);
					res.status(result.status).json({message: result.message, user: result.user})
				})

				.catch(err => res.status(err.status).json({message: err.message}));
		}
	});
	router.post('/verifyemail', (req, res) => {

		const email = req.body.email;

		if (!email) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			register.verifyemail(email)

				.then(result => {

					res.setHeader('Location', '/users/' + email);
					res.status(result.status).json({message: result.message, user: result.user})
				})

				.catch(err => res.status(err.status).json({message: err.message}));
		}
	});
	router.post('/registerfinish', (req, res) => {

		const email = req.body.email;
		const code = req.body.code;

		if (!email || !code) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			register.registerFinish(email,code)

				.then(result => {
					res.status(result.status).json({message: result.message,user: result.user})
				})

				.catch(err => res.status(err.status).json({message: err.message}));
		}
	});
	router.post('/deleteproduct', (req, res) => {

		const productid = req.body.productid;
		var listitem = req.body.listimg;
		var arrImgDel = [];
		if(listitem != "0")
		{
			console.log(listitem);
			arrImgDel = listitem.split(" , ");
			if (arrImgDel.length > 0) {
				for (var i = 0; i <= (arrImgDel.length - 1); i++) {
					fs.unlink(uploadDir + arrImgDel[i], (err) => {
						if (err) console.log(err);
						console.log('successfully deleted /image/' + arrImgDel[i]);
					});
				}
			}
		}
		if (!productid) {
			res.status(400).json({message: 'Invalid Request !'});
		} else {
			fun_product.deleteProduct(productid)
				.then(result => {

					res.status(result.status).json(result)
				})
				.catch(err => res.status(err.status).json({message: err.message}));
		}
	});

	// router.post('/saveproduct', (req,res) => {
	// 	const userid = req.body.usid;
	// 	const productid = req.body.proid;
	// 	console.log(productid,userid);
	// 	if(!productid){
	// 		res.status(400).json({message: 'yeu cau khong hop le'});
	// 	}else {
	// 		fun_product.mSaveProduct(userid,productid)
	// 			.then(result => res.json(result))
	// 			.catch(err => res.status(err.status).json({message: err.message}));
	// 	}
	// });
	router.post('/editproduct', (req, res) => {

		const productid = req.body.productid;
		const userid = req.body.user;
		const productname = req.body.productname;
		const price = req.body.price;
		const time = req.body.time;
		const number = req.body.number;
		const category = req.body.category;
		const address = req.body.address;
		const description = req.body.description;
		var listitem = req.body.listimgdel;
		var arrImgDel = [];
		if(listitem != "0")
		{
			arrImgDel = listitem.split(" , ");
			if (arrImgDel.length > 0 || !listitem || listitem == "") {
				for (var i = 0; i <= (arrImgDel.length - 1); i++) {
					fs.unlink(uploadDir + arrImgDel[i], (err) => {
						if (err) throw err;
						console.log('successfully deleted /image/' + arrImgDel[i]);
					});
				}
			}
		}
		const day = new Date();
		const timestamp = day.getTime();
		if (!productid) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			fun_product.EditProduct(productid, productname, price, time, number, category, address,  description, timestamp,arrImgDel)
				.then(result => {
					res.status(result.status).json({message: result.message, product: result.product})
				})
				.catch(err => res.status(err.status).json({message: err.message}));
		}
	});

	router.post('/createproduct', (req, res) => {
		const userid = req.body.user;
		const productname = req.body.productname;
		const price = req.body.price;
		const time = req.body.time;1
		const number = req.body.number;
		const category = req.body.category;
		const address = req.body.address;
		const description = req.body.description;
		const lat = req.body.lat;
		const lot = req.body.lot;

		const type = req.body.type;

		const day = new Date();
		const timestamp = day.getTime();
		if (!userid) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			fun_product.createproduct(userid, productname, price, time, number, category, address,  description, lat, lot, timestamp, type)

				.then(result => {

					res.setHeader('Location', '/product/' + userid);
					res.status(result.status).json({message: result.message, product: result.product})
				})

				.catch(err => res.status(err.status).json({message: err.message}));
		}
	});
	router.post('/saveproduct', (req, res) => {
		const userid = req.body.userid;
		const productid = req.body.productid;
		const type = req.body.type;
		console.log("saveproduct: "+userid+ " " + productid + " " +type);
		if (!userid || !productid) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			fun_product.saveproduct(userid, productid, type)

				.then(result => {
					res.status(result.status).json({message: result.message})
				})

				.catch(err => res.status(err.status).json({message: err.message}));
		}
	});
	router.post('/addcomment', (req, res) => {
		const userid = req.body.userid;
		const productid = req.body.productid;
		const content = req.body.content;
		const day = new Date();
		const timestamp = day.getTime();
		if (!userid) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			fun_product.addcomment(userid, productid,content, timestamp)

				.then(result => {

					res.status(result.status).json({message: result.message,comment: result.comment})
				})
				.catch(err => res.status(err.status).json({message: err.message}));
		}
	});
	router.post('/deletecomment', (req, res) => {
		const commentid = req.body.commentid;
		const productid = req.body.productid;

		if (!commentid) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			fun_product.deletecomment(commentid,productid)

				.then(result => {

					res.status(result.status).json({message: result.message,comment: result.comment})
				})
				.catch(err => res.status(err.status).json({message: err.message}));
		}
	});
	router.post('/changepassword', (req, res) => {
		const user = req.body.user;
		const oldpass = req.body.oldpass;
		const newpass = req.body.newpass;

		if (!user || !oldpass || !newpass) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			password.changePassword(user,oldpass,newpass)


				.then(result => res.status(result.status).json({ message: result.message }))

				.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});
	router.post('/editinfouser', (req, res) => {
		const userid = req.body.userid;
		const newname = req.body.newname;

		if (!userid) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			profile.editInfoUser(userid,newname)


				.then(result => res.status(result.status).json({user: result.user }))

				.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});
	router.post('/editphonenumber', (req, res) => {
		const userid = req.body.userid;
		const phone = req.body.phone;

		if (!userid) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			profile.editPhoneNumber(userid,phone)


				.then(result => res.status(result.status).json({user: result.user }))

				.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});
	router.post('/push_mess', (req, res) => {
		const message = req.body.message;
		/*		const deviceId = req.body.deviceId;*/
		if (!message) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			push_mess.push_messtotopic(message)

				.then(result => {
					console.log("send");
					res.status(result.status).json({message: result.message,response : result.response})
				})
				.catch(err => {
					console.log("se3246nd");
					res.status(err.status).json({message: err.message});
				})
		}
	});
	router.get('/data/:id', (req, res) => {


		const id = req.params.id;
		profile.getProfile(id)

			.then(result => res.json(result))

			.catch(err => res.status(err.status).json({message: err.message}));


	});
	router.post('/users/:id', (req, res) => {

		if (checkToken(req)) {

			const oldPassword = req.body.password;
			const newPassword = req.body.newPassword;

			if (!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {

				res.status(400).json({message: 'Invalid Request !'});

			} else {

				password.changePassword(req.params.id, oldPassword, newPassword)

					.then(result => res.status(result.status).json({message: result.message}))

					.catch(err => res.status(err.status).json({message: err.message}));

			}
		} else {

			res.status(401).json({message: 'Invalid Token !'});
		}
	});
	router.post('/upload', function (req, res) {
		uploadMedia(req, res)
		/*

				const form = new multipart.Form({uploadDir: './uploads'});

				form.parse(req, function(err, fields, files) {
					console.log(files);//list all files uploaded
					//put in here all the logic applied to your files.
					res.status(200).json({ message: 'Success !' });
				});*/

	});

	router.post('/sendimagechat', function (req, res) {
		const form = new formidable.IncomingForm();
		form.multiples = true;
		form.keepExtensions = true;
		form.uploadDir = uploadDir;
		form.parse(req, (err, fields, files) => {
			if (err) return res.status(500).json({error: err});
			console.log(fields.userfrom,fields.userto,fields.email,fields.name, files.image.path.substring(8));
			fun_product.UpImageChat(fields.userfrom,fields.userto,fields.email,fields.name, files.image.path.substring(8))
				.then(result => res.status(result.status).json({status: result.status, user: result.user}))

		});
	});
	router.post('/changeavatar', function (req, res) {
		const form = new formidable.IncomingForm();
		form.multiples = true;
		form.keepExtensions = true;
		form.uploadDir = uploadDir;
		form.parse(req, (err, fields, files) => {
			if (err) return res.status(500).json({error: err});
			// console.log("image: "+files.image.path.substring(8));
			// console.log("image: "+files.image.path.substring(8));
			// console.log("oldava: "+fields.oldavatar);
			// console.log("image: "+fields.userid);
			fs.unlink(uploadDir + fields.oldavatar, (err) => {
				if (err) console.log(err);
				fun_product.edit_avatar(fields.userid, files.image.path.substring(8))
				.then(result => res.status(result.status).json({status: result.status ,user: result.user}))


			});
			// fun_product.uploadproduct(fields.productid, files.image.path.substring(8));
			// res.status(200).json({uploaded: true})
		});
		// fs.unlink(uploadDir + arrImgDel[i], (err) => {
		// 	if (err) throw err;
		// 	console.log('successfully deleted /image/' + arrImgDel[i]);
		// });
		// uploadMedia(req, res)
	});
	router.post('/users/:id/password', (req, res) => {

		const email = req.params.id;
		const newPassword = req.body.password;

		if (!newPassword) {

			password.resetPasswordInit(email)

				.then(result => res.status(result.status).json({message: result.message}))

				.catch(err => res.status(err.status).json({message: err.message}));

		} else {

			password.resetPasswordFinish(email, newPassword)

				.then(result => res.status(result.status).json({message: result.message}))

				.catch(err => res.status(err.status).json({message: err.message}));
		}
	});
	router.post('/forgotpassword', (req, res) => {

		const email = req.body.email;
		const code = req.body.code
		const newPassword = req.body.password;

		if (!newPassword) {
			password.resetPasswordInit(email)

				.then(result => res.status(result.status).json({message: result.message}))

				.catch(err => res.status(err.status).json({message: err.message}));

		} else {

			password.resetPasswordFinish(email, code, newPassword)

				.then(result => res.status(result.status).json({message: result.message}))

				.catch(err => res.status(err.status).json({message: err.message}));
		}
	});

	function uploadMedia(req, res) { // This is just for my Controller same as app.post(url, function(req,res,next) {....
		const form = new formidable.IncomingForm();
		form.multiples = true;
		form.keepExtensions = true;
		form.uploadDir = uploadDir;
		form.parse(req, (err, fields, files) => {
			if (err) return res.status(500).json({error: err});
			console.log(files.image.path.substring(8));
			fun_product.uploadproduct(fields.productid, files.image.path.substring(8));
			res.status(200).json({uploaded: true, name: fields.user})
		});
		form.on('fileBegin', function (name, file) {
			const [fileName, fileExt] = file.name.split('.');
			file.path = path.join(uploadDir, `${fileName}_${new Date().getTime()}.${fileExt}`)
		})
	}

	function checkToken(req) {

		const token = req.headers['x-access-token'];

		if (token) {

			try {

				const decoded = jwt.verify(token, config.secret);

				return decoded.message === req.params.id;

			} catch (err) {

				return false;
			}

		} else {

			return false;
		}
	}

};
