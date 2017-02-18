var mysql = require("mysql");
var takeSQL = function(){};
takeSQL.prototype.connectDB = function(query,callback){
var querypassed = query;
console.log(query);
   
var con = mysql.createConnection({
host: "sql3.freemysqlhosting.net",
user: "sql3159529",
password: "MT3LZGgPmZ", 
database: "sql3159529"
});

con.connect(function(err){
if(err){
    console.log('Error Connecting to DB');
    return;
}
console.log('Connection Established');
    
});
con.query(querypassed, function(err,rows){
    if(err) return("Bad Query");
    console.log('Data received from Db:\n');
    callback(JSON.stringify(rows));
});
con.end(function(err){
    console.log('Connection ended');
});
}
module.exports = takeSQL;