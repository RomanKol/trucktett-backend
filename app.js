// Load Modules
var express	= require('express'),
	app 	= express(),
	router 	= express.Router(),
	server 	= require('http').createServer(app),
	io 		= require('socket.io')(server),
	mongoose = require('mongoose');

var morgan = require('morgan');

// Bodyparser for POST Body
var	bodyParser 	= require('body-parser');

// Config
var config = require('./config');

// Root Directories
global.images = __dirname + '/app/public/images/';

// Connetct to db
mongoose.connect(config.database);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  console.log('MongoDB connected');
});

// Express Settings
app.use(express.static('app/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

// Routes
// REST
require('./app/routes/')(router, __dirname);
app.use('/trucktett', router);

// SocketIO
require('./app/socket/')(io);

server.listen(80, function () {
	console.log('listening on *:80');
})
