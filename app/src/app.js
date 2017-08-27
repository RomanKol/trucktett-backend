/**  
 * Module dependencies.  
 */ 
var express  = require('express'); 
var connect = require('connect'); 
var app      = express(); 
var port     = process.env.PORT || 8080;  

// Configuration 
app.use(express.static(__dirname + '/public')); 
app.use(connect.logger('dev')); 
app.use(connect.json()); 
app.use(connect.urlencoded());  

// Routes  

//require('./routes.js');  
require('./routes/routes.js')(app);  
//require('./routes/routes.js');  


app.listen(port);  

console.log('! The App runs on port ' + port);



app.get('/test', function (req, res) {
  res.send('Hello World!!');
});



