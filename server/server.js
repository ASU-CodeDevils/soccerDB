var express = require("express");
var path = require("path");

var app = express();
app.set('port', (process.env.port||5000));

app.use(express.static(path.join(__dirname, "../dist")));
app.listen(app.get('port'), function(){
    console.log("Started listening on port", app.get('port'));
})