//This is where the react work happens.

var React = require('react');
var ReactDOM = require('react-dom');
var Griddle = require('griddle-react');
var toDisplay;
var check = false;
function ajaxRequest(){//This function at the top is for avoiding browsers which can't handle ajax. 
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
//This is the only react component we currently have. 
var TestingSQL = React.createClass({
    getInitialState: function(){//React deals in states, the initial state of this component is blank. 
        return{
            input: '',
            result: '', 
            query: '', 
            keyword: ''
        }
    },
    updateInput: function(e){//As information is entered into the input, the state is updated as well. If you took this line out the box would be empty. 
        this.setState({
            input: e.target.value
        });
        if(check)
            {
                this.showResult;
            }
    },
    keywordUpdate: function(e){
      this.setState({
          keyword: e.target.value   
      });  
        
    },
    keywordSearch: function(){
      var search = "SELECT DISTINCT name AS Player, position AS Position,playernumber AS Number, games_played AS Games, teamName AS Team, leagueName AS League FROM Players,Teams, Leagues WHERE ((name LIKE '%"; 
        search +=this.state.keyword + "%' OR position LIKE '%";
        search +=this.state.keyword + "%' OR teamName LIKE '%";
        //search +=this.state.keyword + "%' OR leagueName LIKE '%";
        search +=this.state.keyword + "%') AND Players.teamID=Teams.teamID AND Teams.leagueID=Leagues.leagueID)";
        console.log(search);
        check = true;
         
       this.setState({
            input: search
        }, function aferchange(){this.showResult()});
       
        console.log(this.input);
        
    },
    showResult: function(){//This state update is to handle the query. 
        var results;//Variable to hold thre results. 
        var mypostrequest=new ajaxRequest()//Initializing ajax. 
        mypostrequest.onreadystatechange=function(){
    if (mypostrequest.readyState==4){
    if (mypostrequest.status==200 ||        window.location.href.indexOf("http")==-1){
       //In this ajax request we're making a call to the passed url with our query.
        results=mypostrequest.responseText;
        toDisplay = JSON.parse(results);
         console.log("Request complete.");
      this.setState({
            result: results//We're updating the result state to match the returned results. 
        });  
       
      
    }
    else{//IF the ajax request fails. 
    alert("An error has occured making the request")
    }
    }
        }.bind(this)//Important to bind this, because if we don't this will refer to the mypostrequest.onreadystatechange and the state won't be updated. 
    var sendresult =this.state.input;//Taking the input from the input state and putting it in variable sendresult.
    console.log("value: " + sendresult);//Loggin query
    mypostrequest.open("POST", "http://sportswiz.herokuapp.com/query", true);//Giving ajax the url and type.
    mypostrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");//Encoding.
    mypostrequest.send("query="+sendresult);//Sending our query back to our server. Which will then connect to the database and then return the result of the query.
        check = false;
   
    },
    render: function(){
        return(//Every component in react needs a render function. We can write any html we want in here. Webpack will convert the jsx to js and put it in the  dist folder. Note the curly braces around state values and methods. 
        <div> 
            <h3>Query Database</h3><br></br>
            Submit Query: <input type="text" value={this.state.input} onChange={this.updateInput}/>
            <button onClick={this.showResult}>Query</button><br></br>
            <p>Player/Position/Team Search: <input type= "text" value = {this.state.keyword} onChange={this.keywordUpdate}/><button onClick={this.keywordSearch}>Search</button></p>
            <br></br>
           
            <Griddle results={toDisplay} showSettings={true}/>
            <br></br>
            <p>{this.state.input}</p>
            </div>
        )
    }
});
//Calling reactDOM which will update the DOM as needed. 
ReactDOM.render(
<TestingSQL/>,
    document.getElementById('app')
);