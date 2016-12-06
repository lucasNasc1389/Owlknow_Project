module.exports = function(app){	
	
	var home = app.controllers.home;
	var autenticar = require('../middleware/autenticar');
	
	app.route('/')
		.get(home.cadastro)
		.post(home.cadastrar);
		
	app.route('/login')
		.get(home.login)
		.post(home.entrar);

	app.route('/index')
		.get(autenticar,home.index);

	app.route('/logout')
		.get(home.logout);

}