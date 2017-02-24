var HtmlWEbpackPlugin= require('html-webpack-plugin');
var HtmlWEbpackPluginConfig = new HtmlWEbpackPlugin({
    template: __dirname + '/app/index.html',
    filename: 'index.html',
    inject: 'body'
    
})

module.exports = {
    entry: [
        
        './app/index.js'
    ], 
    output: {
        path:__dirname+ '/dist',
        filename: "index_bundle.js"
    }, 
    module: {
        loaders: [
            {test:/\.js$/,exclude: [/node_modules/, /server/],loader: "babel-loader"},
        ]
    }, 
    plugins:[HtmlWEbpackPluginConfig],
    watch: true
}