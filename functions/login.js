'use strict';
 
const user = new require('../models/user');
const bcrypt = new require('bcryptjs');
 
exports.loginUser = (email, password,tokenfirebase) =>
 
    new Promise((resolve,reject) => {
 
        user.find({email: email})

        .then(users => {
 
            if (users.length === 0) {
 
                reject({ status: 404, message: 'User Not Found !' });
 
            } else {
 
                return users[0];
 
            }
        })
 
        .then(user => {
 
            const hashed_password = user.hashed_password;
 
            if (bcrypt.compareSync(password, hashed_password) && user.status === "1") {
                user.tokenfirebase = tokenfirebase;
                user.save();
                console.log("sdfghfh");
                resolve({ status: 200, user : user });
            } else {
 
                reject({ status: 401, message: 'Invalid Credentials !' });
            }
        })
 
        .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));
 
    });