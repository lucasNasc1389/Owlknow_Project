// UPLOADS DE ARQUIVOS DOS USUÁRIOS

$("#fileUser").on("change", function(event){
	selectedFile = event.target.files[0];
});

function uploadFile() {
	// create root reference
	var filename  = selectedFile.name;
	var storageRef = firebase.storage().ref('/userFiles/' + filename);
	var uploadTask = storageRef.put(selectedFile);

	// Register three observers
	// 1. 'state_changed' observer, called any time state changes
	// 2. Error observer, called on failure
	// 3. Completion observer, called on succesful completion

	uploadTask.on('state_changed', function(snapshot){
		//observe state change events such as progress, pause, and resume
		//see below formore detail
	},
	 function(error){
	 	//Handle unseccessful uploads
	 },

	 function(){
	 	//Handle succesful uploads on complete
	 	//For instance, get the download URL: https://firebasestorage.googleapis.com/...
	 	var nome = $("#nome").val();
	 	var email = $("#email").val();
	 	var legenda = $("#legenda").val();
	 	var comentario = $("#comentario").val();

	 	var postKey = firebase.database().ref("files").push().key;
	 	var downloadURL = uploadTask.snapshot.downloadURL; 
	 	var updates = {};
	 	var postData = {
	 		url: downloadURL,
	 		name: nome,
	 		email: email,
	 		legenda: legenda,
	 		comentario: comentario,
	 		date: Date.now()
	 		}

	 	updates['/files/' + postKey] = postData;
	 	firebase.database().ref().update(updates);
	 	console.log(downloadURL);
	 	console.log(nome);
	 	console.log(email);
	 	});

		if(updates){
			Materialize.toast('Upload feito com sucesso!',4000,'rounded');
		} else{
			console.log(err);
		}
		

}

function queryDatabase(){
	firebase.database().ref('/files/').once('value').then(function(snapshot){
		var fileObject = snapshot.val();
		console.log(fileObject);
		var keys = Object.keys(fileObject);
		for(var i = 0; i < keys.length; i++){
			var currentObject = fileObject[keys[i]];
			if(i % 4 == 0){
				currentRow = document.createElement("div");
				$(currentRow).addClass("contentRow");
				$("#containerFiles").append(currentRow);
			}
			var col = document.createElement("div");
			$(col).addClass("contentCol");
			var image = document.createElement("img");
			image.src = "img/iconFileDownload.png";
			$(image).addClass("contentImage");
			var p = document.createElement("p");
			$(p).html(currentObject.legenda);
			$(p).addClass("contentCaption");
			var p2 = document.createElement("textarea");
			p2.disabled = true;
			$(p2).html(currentObject.comentario);
			$(p2).addClass("contentCaption2");
			var link = document.createElement("a");
			var linkText = document.createTextNode("Download");
			link.appendChild(linkText);
			link.href = currentObject.url;
			link.target = '_blank';
			$(link).html(linkText);
			$(link).addClass("contentLink");
			$(col).append(image);
			$(col).append(p);
			$(col).append(p2);
			$(col).append(link);
			$(currentRow).append(col);
		}
	});
}


$("#avatar").on("change", function(event){
	selectedFile = event.target.files[0];
});

function uploadAvatar() {
	// create root reference
	var filename  = selectedFile.name;
	var storageRef = firebase.storage().ref('/avatarImages/' + filename);
	var uploadTask = storageRef.put(selectedFile);

	// Register three observers
	// 1. 'state_changed' observer, called any time state changes
	// 2. Error observer, called on failure
	// 3. Completion observer, called on succesful completion

	uploadTask.on('state_changed', function(snapshot){
		//observe state change events such as progress, pause, and resume
		//see below formore detail
	},
	 function(error){
	 	//Handle unseccessful uploads
	 },

	 function(){
	 	//Handle succesful uploads on complete
	 	//For instance, get the download URL: https://firebasestorage.googleapis.com/...
	 	var nome = $("#userName").text();
	 	var email = $("#userEmail").text();
	 	var postKey = firebase.database().ref("posts").push().key;
	 	var downloadURL = uploadTask.snapshot.downloadURL; 
	 	var updates = {};
	 	var postData = {
	 		url: downloadURL,
	 		name: nome,
	 		email: email
	 		
	 		}
	 	updates['/posts/' + postKey] = postData;
	 	firebase.database().ref().update(updates);
	 	console.log(downloadURL);
	 	console.log(nome);
	 	console.log(email);

	 	document.getElementById("avatarEscolhido").src=downloadURL;
	 	document.getElementById("avatarImage").src=downloadURL;
	 	});

	
}



