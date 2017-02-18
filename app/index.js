var React = require('react');
var ReactDOM = require('react-dom');

function ajaxRequest(){
 var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"] //activeX versions to check for in IE
 if (window.ActiveXObject){ //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
  for (var i=0; i<activexmodes.length; i++){
   try{
    return new ActiveXObject(activexmodes[i])
   }
   catch(e){
    //suppress error
   }
  }
 }
 else if (window.XMLHttpRequest) // if Mozilla, Safari etc
  return new XMLHttpRequest()
 else
  return false
}

var TestingSQL = React.createClass({
    getInitialState: function(){
        return{
            input: '',
            result: ''
        }
    },
    updateInput: function(e){
        this.setState({
            input: e.target.value
        });
    },
    showResult: function(){
        var results;
        var mypostrequest=new ajaxRequest()
        mypostrequest.onreadystatechange=function(){
    if (mypostrequest.readyState==4){
    if (mypostrequest.status==200 ||        window.location.href.indexOf("http")==-1){
       
        results=mypostrequest.responseText;
         console.log("Are we here?");
      this.setState({
            result: results
        });  
       
      
    }
    else{
    alert("An error has occured making the request")
    }
    }
        }.bind(this)
    var sendresult =this.state.input;
    console.log("value" + sendresult);
    mypostrequest.open("POST", "http://http://sportswiz.herokuapp.com/query", true);
    mypostrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    mypostrequest.send("query="+sendresult);
   
    },
    render: function(){
        return(
        <div> 
            <h3>Query Database</h3><br></br>
            Submit Query: <input type="text" value={this.state.input} onChange={this.updateInput}/>
            <button onClick={this.showResult}>Query</button><br></br>
            <p>{this.state.result}</p>
            </div>
        )
    }
});

ReactDOM.render(
<TestingSQL/>,
    document.getElementById('app')
);