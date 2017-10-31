'use strict';
 
const user = new require('../models/user');
const bcrypt = new require('bcryptjs');
 
exports.loginUser = (email, password,tokenfirebase) =>
 
    new Promise((resolve,reject) => {
 
        user.find({email: email},{listproduct: 0, listsavedproduct: 0})

        .then(users => {
 
            if (users.length === 0) {
 
                reject({ status: 404, message: 'User Not Found !' });
 
            } else {
                if(users[0].status_code !== "0"){
                    console.log(users[0].status_code+"aaa")
					return users[0];
                }else{
					console.log("bbbbbbb")
					reject({ status: 403, message: 'Email not authenticated !' });
                }


            }
        })
 
        .then(user => {
 
            const hashed_password = user.hashed_password;
 
            if (bcrypt.compareSync(password, hashed_password) && user.status_code === "1") {
                user.tokenfirebase = tokenfirebase;
                user.save();
                resolve({ status: 200, user : user });
            } else {

                reject({ status: 401, message: 'Incorrect password !' });
            }
        })
 
        .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));
 
    });