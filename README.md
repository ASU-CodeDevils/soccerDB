# soccerDB

This is a project from a class project. This is for reference in designing the EdApp project because this project used react technology. 
Contains the following tables:
Players
Teams
Games
Leagues
Tournaments

#The repository has the server components added now. 
The app folder contains all the information webpack will need to convert the jsx into js and output it into the dist folder. 
The dist folder also contains takesql which is the connector for the database. This should probably be in it's own folder, because it doesn't get sent to the browser. 
The server folder contains our simple express server. 
Node_modules contains all the packages we're using to run the server in node/js 

.babelrc file tells babel what do do with the jsx. 
webpack.config tells webpack which loaders to use and what to package. 
package.json is the standard npm file listing the packages and some scripts. 


