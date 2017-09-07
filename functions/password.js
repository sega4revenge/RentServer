'use strict';
 
const user = new require('../models/user');
const bcrypt = new require('bcryptjs');
const nodemailer = new require('nodemailer');
const randomstring = new require("randomstring");
const config = new require('../config/config.json');
const ObjectId = require("mongodb").ObjectID;

exports.changePassword = (userid, password, newPassword) =>
 
    new Promise((resolve, reject) => {

        user.find({ _id: Object(userid) })
 
        .then(users => {
 
            let user = users[0];
            const hashed_password = user.hashed_password;
 
            if (bcrypt.compareSync(password, hashed_password)) {
 
                const salt = bcrypt.genSaltSync(10);
                user.hashed_password = bcrypt.hashSync(newPassword, salt);
 
                return user.save();
 
            } else {
 
                reject({ status: 401, message: 'Invalid Old Password !' });
            }
        })
 
        .then(user => resolve({ status: 200, message: 'Password Updated Sucessfully !' }))
 
        .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));
 
    });
 
exports.resetPasswordInit = email =>
    new Promise((resolve, reject) => {
		console.log("Init");
		const random = randomstring.generate(8);
 
        user.find({ email: email })
 
        .then(users => {
 
            if (users.length === 0) {
 
                reject({ status: 404, message: 'User Not Found !' });
 
            } else {
 
                let user = users[0];
 
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(random, salt);
 
                user.temp_password = hash;
                user.temp_password_time = new Date();
 
                return user.save();
            }
        })
 
        .then(user => {
 
            const transporter = nodemailer.createTransport(`smtps://${config.email}:${config.password}@smtp.gmail.com`);
 
            const mailOptions = {
 
                from: `"${config.name}" <${config.email}>`,
                to: email,  
                subject: 'Reset Password Request ', 
                html: `Hello ${user.name},
 
                     Your reset password token is <b>${random}</b>.  
                The token is valid for only 5 minutes.
 
                Thanks,
                Sega Gò Vấp.`
 
            };
 
            return transporter.sendMail(mailOptions);
 
        })
 
        .then(info => {
 
            console.log(info);
            resolve({ status: 200, message: 'Check mail for instructions' })
        })
 
        .catch(err => {
 
            console.log(err);
            reject({ status: 500, message: 'Internal Server Error !' });
 
        });
    });
 
exports.resetPasswordFinish = (email, code, newPassword) =>
    new Promise((resolve, reject) => {
		console.log("Finish");

		user.find({ email: email })
 
        .then(users => {
 
            let user = users[0];
 
            const diff = new Date() - new Date(user.temp_password_time); 
            const seconds = Math.floor(diff / 1000);
            console.log(`Seconds : ${seconds}`);
 
            if (seconds < 300) { return user; } else { reject({ status: 401, message: 'Time Out ! Try again' }); } }) .then(user => {
 
            if (bcrypt.compareSync(code, user.temp_password)) {
 
                const salt = bcrypt.genSaltSync(10);
				user.hashed_password = bcrypt.hashSync(newPassword, salt);
                user.temp_password = undefined;
                user.temp_password_time = undefined;
 
                return user.save();
 
            } else {
 
                reject({ status: 401, message: 'Invalid Code !' });
            }
        })
 
        .then(user => resolve({ status: 200, message: 'Password Changed Successfully !' }))
 
        .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));
 
    });