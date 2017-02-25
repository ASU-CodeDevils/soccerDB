//This is where the react work happens.
//import './index.css';
//import 'bootstrap/dist/css/boostrap.css';
//import 'boostrap/dist/css/boostrap-theme.css';
//import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import SyntaxHighlighter, { registerLanguage } from "react-syntax-highlighter/dist/light";
import sql from 'highlight.js/lib/languages/sql';
import monokaiSublime from 'react-syntax-highlighter/dist/styles/monokai-sublime';

registerLanguage('sql', sql);

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
        <div className="container">
            <div className="jumbotron">
                <h2>Query Database</h2>
                <p><small>Test your sql queries against our database</small></p>
            </div>
            <br />
            <div className="form-group row">
                <label for="lblQuery" className="col-md-2 col-form-label">Submit Query:</label>
                <div className="col-md-4">
                    {/*<input className="form-control" type="text" value={this.state.input} id="lblQuery" onChange={this.updateInput} />*/}
                    <textarea className="form-control" rows="4" cols="47" value={this.state.input} id="lblQuery" onChange={this.updateInput}></textarea>
                </div>
                <button onClick={this.showResult} className="btn btn-primary col-md-1">Query</button>
            </div>
            <div className="row">
                <label for="searchBox" className="col-md-3">Player/Position/Team Search:</label>
                <div className="col-md-3">
                    <input className="form-control" type="text" value={this.state.keyword} id="searchBox" onChange={this.keywordUpdate} />
                </div>
                <button onClick={this.keywordSearch} className="btn btn-primary col-md-1">Search</button>
            </div>

            {/*<p>Player/Position/Team Search: <input type= "text" value = {this.state.keyword} onChange={this.keywordUpdate}/><button onClick={this.keywordSearch}>Search</button></p>*/}
            <br></br>
           
            <Griddle results={toDisplay} showSettings={true}/>
            <br></br>
            <div className="row">
                <div className="col-md-4"></div>
                <SyntaxHighlighter style={monokaiSublime} wrapLines={true} showLineNumbers={true} className="col-md-4">{this.state.input}</SyntaxHighlighter>
                <div className="col-md-4"></div>
            </div>
            <br />
            <br />
            <br />
            <div className="row">
                <img src={"http://codedistrict.io/wp-content/uploads/2015/12/mernstack_icon.gif"} alt="mern" className="img-responsive center-block" />
            </div>
        </div>
        )
    }
});
//Calling reactDOM which will update the DOM as needed. 
ReactDOM.render(
<TestingSQL/>,
    document.getElementById('app')
);