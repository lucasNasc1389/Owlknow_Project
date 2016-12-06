module.exports = function(app) {

	var Usuario = app.models.usuarios;
	var validacao = require('../validacoes/autenticacao');
	var validacaoUser = require('../validacoes/usuarios');


	var HomeController = {
		index: function(req, res){
			res.render('home/index');
		},

		cadastro: function(req, res){
			res.render('home/cadastro', {user : new Usuario()});
		},

		cadastrar: function(req, res){
			var usuario  = new Usuario();
			var email    = req.body.email;
			var password = req.body.senha;

			if (validacaoUser(req, res)) {
				Usuario.findOne({'email': email}, function(err,data){
					if(err) {
						req.flash('erro', 'Erro ao entrar no sistema: '+err);
						res.redirect('/');
					}else if (data) {
						req.flash('erro', 'E-mail já cadastrado tente outro');
						res.redirect('/');
					}else{
						var model 		= new Usuario();
						model.nome 		= req.body.nome;
						model.email 	= req.body.email;
						model.password 	= model.generateHash(req.body.senha);
						model.save(function(err, data){
							if(!err){
								req.session.usuario = data;
								res.redirect('/index');
							}
						});
					}
				});
			}else{
				res.redirect('/');
			}
			},
			
		login: function(req, res){
			res.render('home/login');
		},

		entrar: function(req, res){
			if(validacao(req,res)) {
				var usuario 		= new Usuario();
				var email 			= req.body.email;
				var password 		= req.body.senha;

				Usuario.findOne({'email': email}, function(err,data){
					if(err) {
						req.flash('erro', 'Erro ao entrar no sistema: '+err);
						res.redirect('/login');
					}else if(!data) {
						req.flash('erro', 'Email não encontrado!');
						res.redirect('/login');
					}else if(!usuario.validPassword(password, data.password)){
						req.flash('erro', 'Senha não confere!');
						res.redirect('/login');
					}else{
						req.session.usuario = data;
						res.redirect('/index');
					}
				});
			}else{
				res.redirect('/login');
			}

		},

		logout: function(req, res){
			req.session.destroy();
			res.redirect('/');
		}
	}

	return HomeController;
}