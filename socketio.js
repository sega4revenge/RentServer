'use strict';

const fun_product = require('./functions/fun_product');

module.exports = io => {
	const usernames = {};
	const rooms = [];
	let numUsers =0;

	function check_key(v)
	{
		let val = "";

		for(const key in usernames)
		{
			if(usernames[key] === v)
				val = key;
		}
		return val;
	}
	io.on('connection', function(socket) {

		socket.on('getData', function (userFrom,userTo,userIdOnline) {
		console.log(userFrom,userTo);
		console.log(userIdOnline + " đã online");
		rooms[userFrom+"-"+userTo].push(userIdOnline);
		console.log(rooms[userFrom+"-"+userTo][0] + " đã online2");




		//check room  co ton cmn tai k co thi lay du lieu ve
		var ss=	fun_product.checkRoomChat(userFrom,userTo)

			if(ss!=null)
			{
				socket.emit(userFrom+" - "+userTo, ss);
			}else{
				socket.emit(userFrom+" - "+userTo, []);
			}

		});
		socket.on('sendchat', function (id,userFrom,userTo,name,message) {
			//gui tin nhan len server
			console.log(id,userFrom,userTo,name,message);

			var ss=	fun_product.sendMessChat(id,userFrom,userTo,name,message)

			if(ss)
			{
				console.log("222222222222");
				socket.emit('sendchat: '+userFrom+" - "+userTo,userFrom,userTo, name,message);
				//socket.emit('send_message: '+userFrom+" - "+userTo,userFrom, name,message);
			}

		});


		// socket.on('sendchat', function (data) {
		// 	// we tell the client to execute 'updatechat' with 2 parameters
		// 	io.sockets.emit('updatechat', socket.username, data);
		// });

		// when the client emits 'adduser', this listens and executes
		socket.on('add user', function(username){

			// we store the username in the socket session for this client
			socket.username = username;
			console.log(username + " đã online");

			++numUsers;
			// add the client's username to the global list
			usernames[username] = socket.id;
			// echo to client they've connected
			socket.emit('login', {
				username: username

			});
			socket.emit('updatechat', 'SERVER', 'you have connected');
			// echo to client their username
			socket.emit('store_username', username);
			// echo globally (all clients) that a person has connected
			socket.broadcast.emit('userconnect', {
				username: socket.username,
				numUsers: numUsers
			});
			// update the list of users in chat, client-side
			io.sockets.emit('updateusers', usernames);
		});

		// when the user disconnects.. perform this
		socket.on('disconnect', function(){
			// remove the username from global usernames list
			delete usernames[socket.username];
			// update list of users in chat, client-side
			io.sockets.emit('updateusers', usernames);
			// echo globally that this client has left
			socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		});

		// when the user sends a private msg to a user id, first find the username
		socket.on('check_user', function(asker, id){
			//console.log("SEE: "+asker); console.log(id);
			io.sockets.socket(usernames[asker]).emit('msg_user_found', check_key(id));
		});

		// when the user sends a private message to a user.. perform this
		socket.on('msg_user', function(usr, username, msg) {
		/*	console.log("From user: "+username);
			console.log("To user: "+usr);
			console.log(usernames);*/
			io.sockets.socket(usernames[usr]).emit('msg_user_handle', username, msg);

			fs.writeFile("chat_data.txt", msg, function(err) {
				if(err) {
					console.log(err);
				} /*else {
			console.log("The file was saved!");
			}*/
			});
		});


	});
};