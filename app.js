const KEY = 'owlknow.sid';
const SECRET = 'owlk'

var express          = require('express'),
    app              = express(),
    server           = require('http').createServer(app),
    io               = require('socket.io').listen(server),
    path             = require('path'),
    favicon          = require('serve-favicon'),
    logger           = require('morgan'),
    cookieParser     = require('cookie-parser'),
    bodyParser       = require('body-parser'),
    errorhandler     = require('errorhandler'),
    session          = require('express-session'),
    debug            = require('debug'),
    method           = require('method-override'),
    multer           = require('multer'),
    load             = require('express-load'),
    mongoose         = require('mongoose'),
    flash            = require('express-flash'),
    expressValidator = require('express-validator'),
    moment           = require('moment'),
    cookie           = cookieParser(SECRET),
    store            = new session.MemoryStore(),
    upload           = multer({dest: 'uploads/'});


// Conexão com o mongoDB
mongoose.connect('mongodb://localhost/owlk', function(err){
    if(err){
        console.log("Erro ao conectar com o MongoDB: "+err)
    }else{
        console.log("Conexão com o mongodb efetuada com sucesso!");
    }
});

// Compartilhando a sessão do express no Socket.IO
io.use(function(socket, next){
    var data = socket.request;
    cookie(data, {}, function(err) {
        var sessionID = data.signedCookies[KEY];
        store.get(sessionID, function(err, session) {
            if(err || !session) {
                return next(new Error('Acesso negado!'));
            }else{
                socket.handshake.session = session;
                return next();
            }
        });
    });
});


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(methodOverride());
app.use(cookie);
app.use(session({ 
                  secret: SECRET,
                  name: KEY,
                  resave: true,
                  saveUninitialized: true,
                  store: store
              }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

//helpers
app.use(function(req,res,next){
    res.locals.session  = req.session.usuario;
    res.locals.isLogged = req.session.usuario ? true : false;
    res.locals.moment   = moment;
    next();
});

// loads
load('models').then('controllers').then('routes').into(app);
load('sockets').into(io);

    
// servidor
server.listen(app.get('port'), function(){
    console.log('Servidor rodando na porta ' + app.get('port'));
});










