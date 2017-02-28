//This is where the react work happens.
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
var TestingSQL = React.createClass({
    componentDidMount: function(){
        this.buildTeams();
        this.buildPositions();
        this.getLeagues();
    },
    
    getInitialState: function(){
        return{
            input: '',
            result: '', 
            query: '', 
            keyword: '',
            showAdmin: false,
            teams: null, 
            positions: null,
            leagues: null,
            ajaxtopass: null,
            dropdown: ['Select Option','Teams', 'Leagues', 'Teams Undefeated', 'Teams Positive win/loss Ratio', 'Tournament Winners', 'Tournament Games'],
            dropselect: ''
        }
    },
    dropDownUpdate: function(event){
      this.setState({dropselect: event.target.value}, function showdrop(){this.showingdrop()});  
    },
    showingdrop: function(){
      if(this.state.dropselect=='Teams')
          {
              var teamselect = 'SELECT teamName AS Teams, leagueName AS League FROM Teams, Leagues WHERE (Teams.leagueID Like Leagues.leagueID)';
              this.setState({query: teamselect}, function toshow(){this.showResult()});
          }
        else if(this.state.dropselect=='Leagues')
          {
              var teamselect = 'SELECT leagueName AS League FROM Leagues';
              this.setState({query: teamselect}, function toshow(){this.showResult()});
          }
        else if(this.state.dropselect=='Teams Undefeated')
          {
              var teamselect = 'SELECT teamName AS Teams FROM Teams WHERE (games_lost Like 0)';
              this.setState({query: teamselect}, function toshow(){this.showResult()});
          }
        else if(this.state.dropselect=='Teams Positive win/loss Ratio')
          {
              var teamselect = 'SELECT teamName AS Teams, games_won AS Wins, games_lost AS Lost FROM Teams WHERE (games_lost < games_won)';
              this.setState({query: teamselect}, function toshow(){this.showResult()});
          }
        else if(this.state.dropselect=='Tournament Winners')
          {
              var teamselect = 'SELECT tournamentName AS Tournament, teamName AS Winner FROM Teams, Tournaments WHERE winnerID LIKE teamID';
              this.setState({query: teamselect}, function toshow(){this.showResult()});
          }
        else if(this.state.dropselect=='Tournament Games')
          {
              var teamselect = 'SELECT tournamentName AS Tournament, scoreHome AS \'Score Home\',scoreAway AS \'Score Away\', Team1.teamName AS Home, Team2.teamName AS Away, Team3.teamName AS Winner FROM Teams AS Team1, Teams AS Team2, Teams As Team3,Games, Tournaments WHERE (Tournaments.tournamentID LIKE Games.tournamentID AND homeID LIKE Team1.teamID AND awayID LIKE Team2.teamID AND Games.winnerID LIKE Team3.teamID)';
              this.setState({query: teamselect}, function toshow(){this.showResult()});
          }
    },
    showAddScreen: function(){
      this.setState({showAdmin: true});
       
    },
    closeAddScreen: function(){
      this.setState({showAdmin:false});  
    },
    getLeagues: function(){
      this.genericQuery("SELECT leagueName FROM Leagues",this.buildLeagues);  
    },
    buildLeagues: function(){
        var leagues = this.state.ajaxtopass;
         var returnLeagues = [];
        for(var i = leagues.length -1;i>=0;--i)
            {
                var o = leagues[i];
                for(var key in o){
                    returnLeagues.push(o[key]);
                }
            }
        this.setState({ 
            leagues: returnLeagues
        });
        console.log(returnLeagues);
    },
    genericQuery: function(toquery, callback){//for ajax request from child components. Passes as json.
         var results;//Variable to hold thre results. 
        var mypostrequest=new ajaxRequest()//Initializing ajax. 
        mypostrequest.onreadystatechange=function(){
            console.log(mypostrequest.status);
    if (mypostrequest.readyState==4){
    if (mypostrequest.status==200 ||        window.location.href.indexOf("http")==-1){
       //In this ajax request we're making a call to the passed url with our query.
        results=mypostrequest.responseText;
        results = JSON.parse(results);
         console.log(results);
         console.log("Request complete.");
         
      this.setState({
            ajaxtopass: results//We're updating the result state to match the returned results. 
            
        }, function tocall(){callback()});  
       
      
    }
    else{//IF the ajax request fails. 
    alert("An error has occured making the request")
    }
    }
        }.bind(this)//Important to bind this, because if we don't this will refer to the mypostrequest.onreadystatechange and the state won't be updated. 
    var sendresult =toquery;//Taking the input from the input state and putting it in variable sendresult.
    console.log("value: " + sendresult);//Loggin query
    mypostrequest.open("POST", "http://sportswiz.heroku.com/query", true);//Giving ajax the url and type.
    mypostrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");//Encoding.
    mypostrequest.send("query="+sendresult);//Sending our query back to our server. Which will then connect to the database and then return the result of the query.
        check = false;
   
    },
    updateInput: function(e){//As information is entered into the input, the state is updated as well. If you took this line out the box would be empty. 
    
        this.setState({
            input: e.target.value,
            query: e.target.value
        });
       
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
            query: search
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
            result: results,//We're updating the result state to match the returned results. 
            
        });  
       
      
    }
    else{//IF the ajax request fails. 
    alert("An error has occured making the request")
    }
    }
        }.bind(this)//Important to bind this, because if we don't this will refer to the mypostrequest.onreadystatechange and the state won't be updated. 
    var sendresult =this.state.query;//Taking the input from the input state and putting it in variable sendresult.
    console.log("value: " + sendresult);//Loggin query
    mypostrequest.open("POST", "http://sportswiz.heroku.com/query", true);//Giving ajax the url and type. sportswiz.herokuapp.com
    mypostrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");//Encoding.
    mypostrequest.send("query="+sendresult);//Sending our query back to our server. Which will then connect to the database and then return the result of the query.
        check = false;
   
    },
    buildTeams: function(){//This state update is to handle the query. 
        var results;
        var mypostrequest=new ajaxRequest()//Initializing ajax. 
        mypostrequest.onreadystatechange=function(){
    if (mypostrequest.readyState==4){
    if (mypostrequest.status==200 ||        window.location.href.indexOf("http")==-1){
       //In this ajax request we're making a call to the passed url with our query.
        results=mypostrequest.responseText;
        var tjson = JSON.parse(results);
        var returnTeam = [];
        for(var i = tjson.length -1;i>=0;--i)
            {
                var o = tjson[i];
                for(var key in o){
                    returnTeam.push(o[key]);
                }
            }
         console.log("Request complete.");
        console.log(returnTeam);
      this.setState({
             
            teams: returnTeam
        });  
       
      
    }
    else{//IF the ajax request fails. 
    alert("An error has occured making the request")
    }
    }
        }.bind(this)//Important to bind this, because if we don't this will refer to the mypostrequest.onreadystatechange and the state won't be updated. 
    var sendresult =this.state.input;//Taking the input from the input state and putting it in variable sendresult.
    console.log("value: " + sendresult);//Loggin query
    mypostrequest.open("POST", "http://sportswiz.heroku.com/query", true);//Giving ajax the url and type.
    mypostrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");//Encoding.
    mypostrequest.send("query=SELECT teamName FROM Teams");//Sending our query back to our server. Which will then connect to the database and then return the result of the query.
        check = false;
   
    },
     buildPositions: function(){//This state update is to handle the query. 
        var results;
        var mypostrequest=new ajaxRequest()//Initializing ajax. 
        mypostrequest.onreadystatechange=function(){
    if (mypostrequest.readyState==4){
    if (mypostrequest.status==200 ||        window.location.href.indexOf("http")==-1){
       //In this ajax request we're making a call to the passed url with our query.
        results=mypostrequest.responseText;
        var tjson = JSON.parse(results);
        var returnpositions = [];
        for(var i = tjson.length -1;i>=0;--i)
            {
                var o = tjson[i];
                for(var key in o){
                    returnpositions.push(o[key]);
                }
            }
         console.log("Request complete.");
        console.log(returnpositions);
      this.setState({
             
            positions: returnpositions
        });  
       
      
    }
    else{//IF the ajax request fails. 
    alert("An error has occured making the request")
    }
    }
        }.bind(this)//Important to bind this, because if we don't this will refer to the mypostrequest.onreadystatechange and the state won't be updated. 
    var sendresult =this.state.input;//Taking the input from the input state and putting it in variable sendresult.
    console.log("value: " + sendresult);//Loggin query
    mypostrequest.open("POST", "http://sportswiz.heroku.com/query", true);//Giving ajax the url and type.
    mypostrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");//Encoding.
    mypostrequest.send("query=SELECT DISTINCT position FROM Players");//Sending our query back to our server. Which will then connect to the database and then return the result of the query.
        check = false;
   
    },
    render: function(){
         var listItems = this.state.dropdown.map(function(items){
          return <option value ={items}>{items}</option>
      });
        return(//Every component in react needs a render function. We can write any html we want in here. Webpack will convert the jsx to js and put it in the  dist folder. Note the curly braces around state values and methods.
        /*<div> 
            <h3>Query Database</h3><br></br>
            Submit Query: <input type="text" value={this.state.input} onChange={this.updateInput}/>
            <button onClick={this.showResult}>Query</button><br></br>
            
            <p>Player by Name/Position/Team Search: <input type= "text" value = {this.state.keyword} onChange={this.keywordUpdate}/><button onClick={this.keywordSearch}>Search</button></p>
            <br></br>
            
            <input type = "submit" value="Admin" onClick={this.showAddScreen}/>
             {this.state.showAdmin ? <input type = "submit" value="close" onClick={this.closeAddScreen}/> : null }
             {this.state.showAdmin ? <Admin teamlist={this.state.teams} positionlist={this.state.positions} ajax={this.genericQuery} result={this.state.ajaxtopass}/> : null}
            
             <br></br>
            {this.state.showAdmin ? <Teamadd leaguelist={this.state.leagues}  ajax={this.genericQuery} result={this.state.ajaxtopass} added={this.buildTeams}/> : null}
            <Griddle results={toDisplay} showSettings={true}/>
            <br></br>
            <p>{this.state.query}</p>
            
            
            
            </div>*/
            
            
            
            
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
             <br></br>
             <select value ={this.state.dropselect} onChange={this.dropDownUpdate}>
             {listItems}
             </select>
             <br></br>
             <br></br>
             <button onClick={this.showAddScreen} className="btn btn-primary col-md-1">Admin</button>
            
             {this.state.showAdmin ? <button onClick={this.closeAddScreen} className="btn btn-primary col-md-1">Close</button> : null }
            <br></br>
             {this.state.showAdmin ? <Admin teamlist={this.state.teams} positionlist={this.state.positions} ajax={this.genericQuery} result={this.state.ajaxtopass}/> : null}
            
             <br></br>
            {this.state.showAdmin ? <Teamadd leaguelist={this.state.leagues}  ajax={this.genericQuery} result={this.state.ajaxtopass} added={this.buildTeams}/> : null}
            {/*<p>Player/Position/Team Search: <input type= "text" value = {this.state.keyword} onChange={this.keywordUpdate}/><button onClick={this.keywordSearch}>Search</button></p>*/}
            <br></br>
          
            <Griddle results={toDisplay} showSettings={true}/>
            <br></br>
            <div className="row">
                <div className="col-md-4"></div>
                <SyntaxHighlighter style={monokaiSublime} wrapLines={true} showLineNumbers={true} className="col-md-4">{this.state.query}</SyntaxHighlighter>
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

var Form = React.createClass ({
    componentDidMount: function(){
        console.log(this.props.val);
        this.props.updateTeam(this.props.val);
      this.setState({value:this.props.val});  
    },
    getInitialState: function() {
    
    return{
        value:this.props.val
    }

   
  },

  handleChange: function(event) {
    this.setState({value: event.target.value});
    this.props.updateTeam(event.target.value);
  },

  

  render: function(){
      var listItems = this.props.items.map(function(items){
          return <option value ={items}>{items}</option>
      });
    return (
        
            <div>
            
            <select value = {this.state.value} onChange={this.handleChange}>
            {listItems}
        
          </select>
        </div>
        
        
      
    )
  }
});
var Admin = React.createClass({
   
    getInitialState: function(){
        return{
            name: null,
            number: null,
            gamesplayed: 0,
            currentTeam: '', 
            playerid: '',
            currentPosition: '',
            teamID: '',
            error: ''
            
        }
    }, 
    updateName: function(e){
        this.setState({name: e.target.value});
    },
    updateNumber: function(e){
        this.setState({number: e.target.value});
    }, 
    updateGames: function(e){
        this.setState({gamesplayed: e.target.value});
    },
    updateTeam: function(e){
         this.setState({currentTeam: e});  
    },
    updatePosition: function(e){
        this.setState({currentPosition: e});
    },
    infoConvert: function(e){//This state update is to handle the query. 
        e.preventDefault();
        console.log("here");
        this.props.ajax("SELECT teamID from Teams WHERE teamName =\""+ this.state.currentTeam+ "\"", this.getnextplayerid);
        
       
    },
    getnextplayerid: function(){
        this.setState({
            teamID: this.props.result[0].teamID
        }, function toprocess(){this.gotid()});
     // console.log(this.state.teamID);  
    },
    gotid: function(){
      console.log(this.state.teamID); 
      console.log("get Count");
        this.props.ajax("SELECT COUNT(playerID) FROM Players", this.computenumber);
    },
    computenumber: function(){
        var numb = this.props.result[0];
        for(var key in numb)
            {
                numb = numb[key];
            }
        numb++;
        console.log(numb);
        this.setState({
          playerid: numb
      }, function finalcheck(){this.insert()});  
    },
    insert: function(){
        this.message();
      if(this.state.name!=null&&this.state.number!=null)
          {
              console.log("here");
              this.props.ajax("INSERT INTO Players(playerID, name, playernumber, position, teamID, games_played) VALUES("+this.state.playerid+", \'"+ this.state.name + "\', "+this.state.number +", \'"+this.state.currentPosition+ "\', "+this.state.teamID+", "+this.state.gamesplayed +")",this.message);
          }
        else
            {
                this.setState({
                    error: "You must enter a name and number."
                });
            }
    },
    message: function(){
        var list = document.getElementById("clear").getElementsByTagName("input");
        for(var each in list){
            list[each].value = "";
        }
        console.log(list);
        console.log("Insert complete");
        this.setState({
           name: null, 
           number: null,
           gamesplayed: 0,
           error: "Insert Complete"
        });
    },
    render: function(){
        return(
            <div>
            <h3> Players:</h3>
            <form  >
            <label>
            <div id="clear">
            Name:
            <input className="form-control" type="text" value={this.state.name} onChange={this.updateName}/>
            
            Number:
            <input className="form-control" type="number" value={this.state.number} onChange={this.updateNumber}/>
            &nbsp;
            </div>
            <br></br>
            Games Played: 
            <input className="form-control" type="number" value={this.state.gamesplayed} onChange={this.updateGames}/>
            <br>
            </br>
            Team:
            <Form val={this.props.teamlist[0]} items={this.props.teamlist} updateTeam={this.updateTeam}/>
            <br></br>
            Positions:
            <Form val={this.props.positionlist[0]} items={this.props.positionlist} updateTeam={this.updatePosition}/>
            
            <br></br>
            <button onClick={this.infoConvert} className="btn btn-primary col-md-5" >Add Player</button>
            <br></br>
            {this.state.error}
            </label>
            </form>
            </div>
        )
    }
    
});
//The component today handles the team add. 
var Teamadd = React.createClass({
   
    getInitialState: function(){
        return{
            name: null,
            gameswon: 0,
            gameslost: 0, 
            leagueid: '',
            leaguename: '',
            teamID: '',
            error: ''
            
        }
    }, 
    updateName: function(e){
        this.setState({name: e.target.value});
    },
    updateGamesWon: function(e){
        this.setState({gameswon: e.target.value});
    }, 
    updateGamesLost: function(e){
        this.setState({gameslost: e.target.value});
    },
    updateLeagueName: function(e){
         this.setState({leaguename: e});  
    },
    infoConvert: function(e){//This state update is to handle the query. 
        e.preventDefault();
        console.log("here");
        this.props.ajax("SELECT leagueID from Leagues WHERE leagueName =\""+ this.state.leaguename+ "\"", this.getnextid);
        
       
    },
    getnextid: function(){
        this.setState({
            leagueid: this.props.result[0].leagueID
        }, function toprocess(){this.gotid()});
     // console.log(this.state.teamID);  
    },
    gotid: function(){
      console.log(this.state.leagueid); 
      console.log("get Count");
        this.props.ajax("SELECT COUNT(teamID) FROM Teams", this.computenumber);
    },
    computenumber: function(){
        var numb = this.props.result[0];
        for(var key in numb)
            {
                numb = numb[key];
            }
        numb++;
        console.log(numb);
        this.setState({
          teamID: numb
      }, function finalcheck(){this.insert()});  
    },
    insert: function(){
        this.message();
      if(this.state.name!=null)
          {
              console.log("here");
              this.props.ajax("INSERT INTO Teams(teamID, teamName, games_won, games_lost, leagueID) VALUES("+this.state.teamID+", \'"+ this.state.name + "\', "+this.state.gameswon +", "+this.state.gameslost+ ", "+this.state.leagueid+")",this.message);
          }
        else
            {
                this.setState({
                    error: "You must enter a name."
                });
            }
    },
    message: function(){
        var list = document.getElementById("clear2").getElementsByTagName("input");
        for(var each in list){
            list[each].value = "";
        }
        console.log(list);
        console.log("Insert complete");
        this.props.added();
        this.setState({
           name: null, 
           number: null,
           gamesplayed: 0,
           error: "Insert Complete"
        });
    },
    render: function(){
        return(
            <div>
            <h3> Teams:</h3>
            <form class="pure-form pure-form-stacked">
            <label>
            <div id="clear2">
            Team:
            <input className="form-control" type="text" value={this.state.name} onChange={this.updateName}/>
            &nbsp;
             </div>
            <br></br>
            Games Won:
            <input className="form-control" type="number" value={this.state.gameswon} onChange={this.updateGamesWon}/>
            &nbsp;
            Games Lost: 
            <input className="form-control" type="number" value={this.state.gameslost} onChange={this.updateGamesLost}/>
            <br>
            </br><br></br>
            League:
            <Form val={this.props.leaguelist[0]} items={this.props.leaguelist} updateTeam={this.updateLeagueName}/>
            <br></br>
           
            <button onClick={this.infoConvert} className="btn btn-primary col-md-5">Add Team</button>
            <br></br>
            {this.state.error}
            </label>
            </form>
            </div>
        )
    }
    
}); 


//Calling reactDOM which will update the DOM as needed. 
ReactDOM.render(
<TestingSQL/>,
    document.getElementById('app')
);