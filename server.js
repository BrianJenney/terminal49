
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const routes = require('./api/routes.js');

//serve the files on local server
app.use(express.static(__dirname + '/'));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});
  
// Configure body parser for AJAX requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

  
//set up a port to listen for incoming requests
app.set( 'port', ( process.env.PORT || 3000 ));

// Start node server
app.listen( app.get( 'port' ),() =>{
console.log( 'Node server is running on port ' + app.get( 'port' ));
});

// //ROUTES
app.use(routes);

