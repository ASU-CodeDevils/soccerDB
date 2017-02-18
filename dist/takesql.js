//This takes a query and sends it to the database and then returns the result. 

var mysql = require("mysql");//Js plugin for mysql
var takeSQL = function(){};//Establishing function.
takeSQL.prototype.connectDB = function(query,callback){//We will take the query here and then make the callback when we get a response. 
var querypassed = query;//Saving query value.
console.log(query);//Logging query
   
var con = mysql.createConnection({
host: "sql3.freemysqlhosting.net",
user: "sql3159529",
password: "MT3LZGgPmZ", 
database: "sql3159529"
});//Connection information for database.

con.connect(function(err){//making connection.
if(err){
    console.log('Error Connecting to DB');
    return;//Break if it can't connect to database.
}
console.log('Connection Established');
    
});
con.query(querypassed, function(err,rows){//Sending the query.
    if(err) return("Bad Query");//It should return this message if the query isn't a good query.
    console.log('Data received from Db:\n');
    callback(JSON.stringify(rows));//Taking the JSON file and converting it to a string for the purposes of displaying it on the webpage.
    //I think we can find a plugin to take the json and tabulate it rather than writing our own.
});
con.end(function(err){
    console.log('Connection ended');//Connection is ended once the query is returned. 
});
}
module.exports = takeSQL;//Export for access in another js file. 