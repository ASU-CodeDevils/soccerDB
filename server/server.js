// Simple Express server we can use to handle the traffic 
// from the website. 

var express = require("express");//espress package
var path = require("path");//For directing paths
var bodyParser = require('body-parser');//For getting information from response.

var app = express();//Initializing express.
var takeSQL = require('../dist/takesql.js');//We're including the js file which connects to the data base.

connection = new takeSQL();//Initializing the connection to database. 
app.use(bodyParser.json());//using parser. 
app.use(bodyParser.urlencoded({extended: true}));//Setting parser encoding. 
app.set('port', (process.env.PORT||5000));//Setting port. It will get a port when on Heroku, if you run local it will be localhost:5000

//The route below catches the request to query the database.
app.post('/query', function(req,res){
    console.log("Received Query");
    console.log(req.body.query);//Printing query
   
   function tosend(q){//Function for callback when the database returns the information from the query. 
        res.status(200).send(q);//Sending information back. 
        console.log("sent" + q);//Logging information sent.
    }
    if(req.body.query!=' '){
    connection.connectDB(req.body.query, tosend);//Calling the databaseconnection with the query from the ajax request. 
    }    
   
})
app.use(express.static(path.join(__dirname, "../dist")));//Direction of other static trafic to the folder with the index file. 
app.listen(app.get('port'), function(){
    console.log("Started listening on port", app.get('port'));//Starting up the server. 
})