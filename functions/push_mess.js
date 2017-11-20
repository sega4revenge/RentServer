'use strict';
const FCM = require("fcm-node");

const fcm = new FCM("AAAAW7P9c88:APA91bGd_ElMciDxNQtJUdXY2lUZzb_z2bEjXpSRZNj2tE2B7ehaJF12T9JStlEVh7xi672fc7J5B-iVpvAjSRzIK2Dt9S7s-xMTliKL7QjsalQT8vK2U-UTo7fxMkTfdzr7C6iBqjKn");
exports.push_mess = (msg,deviceId) =>

    new Promise((resolve, reject) => {
		const m = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
			registration_ids: deviceId,

			data: {
				message: msg
			}
		};
		console.log(msg);

		fcm.send(m, function(err, response){
			if (err) {
				console.log(err);
				reject({status: 409, message: 'Error !'});
			} else {
				console.log(response);
				resolve({status: 201, message: 'User Registered Sucessfully !',response : response});

			}
		});


    });

exports.push_messtotopic = (msg) =>

	new Promise((resolve, reject) => {
		const m = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
			to: '/topics/599a9614d8c93b200903e1ab',

			data: {
				message: msg
			}
		};
		console.log(msg);

		fcm.send(m, function(err, response){
			if (err) {
				console.log(err);
				reject({status: 409, message: 'Error !'});
			} else {
				console.log(response);
				resolve({status: 201, message: 'User Registered Sucessfully !',response : response});

			}
		});


	});