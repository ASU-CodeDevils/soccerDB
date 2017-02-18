var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var app = express();
var takeSQL = require('../dist/takesql.js');

connection = new takeSQL();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('port', (process.env.PORT||5000));

app.post('/query', function(req,res){
    console.log("here");
    console.log(req.body.query);
    //var query =connection.connectDB(req.body.query);
   function tosend(q){
        res.send(q);
        console.log("sent" + q);
    }/*
    function torequest(err,callback){
        var query = connection.connectDB(req.body.query);
        console.log(query);
        callback(query);
    }
    torequest("Testing",tosend);*/
    if(req.body.query!=' '){
    connection.connectDB(req.body.query, tosend);//{
       // console.log("something");
      // res.send("something");
       // console.log(data);
  //  });
    }
    console.log("after");
    
    //res.send(query);
})
app.use(express.static(path.join(__dirname, "../dist")));
app.listen(app.get('port'), function(){
    console.log("Started listening on port", app.get('port'));
})