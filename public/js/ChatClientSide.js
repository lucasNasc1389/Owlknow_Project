var socket = io.connect('http://localhost:3000');


socket.on('welcome', function(){ $('#chat').append('<li id="msgBoasvindas"> Bem vindo ao Owlknow!</li>');});

socket.on('load old messages', function(docs){
	for(var i = 0; i < docs.length; i++){
		displayMsg(docs[i]);
	}
})

function displayMsg(data){
	var msg = "<div class='card-panel'><img src='/img/avatar.png' id='user' class='circle'><span id='user'><b>"+data.nome+"</b></span><p id='msg'>"+data.msg+"</p></div>";
	document.getElementById('chat').innerHTML += msg;
}

// Enviando mensagem
socket.on('send-client', function(data){
	var msg = "<div class='card-panel' id='cards'><img src='/img/avatar.png' id='user' class='circle'><span id='user'><b>"+data.nome+"</b></span><p id='msg'>"+data.msg+"</p></div>";
	document.getElementById('chat').innerHTML += msg;
	//var cards = document.getElementById('cards');
	console.log(msg);
});


var enviar = function() {
	var email = document.getElementById('email').value;
	var nome = document.getElementById('nome').value;
	var msg  = document.getElementById('mensagem').value;
	
	if(msg){
		
	socket.emit('send-server', {email: email, nome: nome, msg: msg});
	document.getElementById('mensagem').value = '';
	}else{
	return false;
	}
};

