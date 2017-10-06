var express = require('express');
//var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
var handlebars  = require('express-handlebars'), hbs;
var app      = express();
var server   = require('http').Server(app);
var io       = require('socket.io')(server);
var partial = require('express-partial');    


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(partial());
app.use(function(req,res,next){
	req.io = io;
	next();
});
app.use(express.static(path.join(__dirname, 'public')));    
app.use(express.static(path.join(__dirname, 'static')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// send app to router
require('./router')(app);
var db = require('./config/database');
	// Connect to Mongo on start
	db.connect('mongodb://45.112.125.25:2727/db_indorse', function(err) {
	  if (err) {
		console.log('Unable to connect to Mongo.')
		process.exit(1)
	  } else {
		  
		  server.listen(5000);
	      console.log('Express server listening on port 5000');
		  
	  }
	})




