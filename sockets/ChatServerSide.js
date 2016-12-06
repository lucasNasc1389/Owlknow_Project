module.exports = function(io) {
var sockets = io.sockets;
var mongoose = require('mongoose');

var chatSchema = mongoose.Schema({
		email: String,
		nome: String,
		msg: String,
		created: {type: Date, default: Date.now}
	});


sockets.on('connection', function(client){
	var session = client.handshake.session;
	var userid = session.nome;
	var chat = mongoose.model('Messages', chatSchema);
	
	client.emit('welcome');

	chat.find({}, function(err, docs){
		if(err) throw err;
		console.log('enviando mensagens antigas...');
		client.emit('load old messages', docs);
	});
	

	client.on('send-server', function(data){
	 	client.emit('send-client', {
			nome: data.nome,
			msg: data.msg
		});
		client.broadcast.emit('send-client', {
			nome: data.nome,
			msg: data.msg
		});

		var newMsg = new chat({email: data.email, nome: data.nome, msg: data.msg});
		newMsg.save(function(err){
			if(err) throw err;
				data;
			});
	});
});



 
 }


