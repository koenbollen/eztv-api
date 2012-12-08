
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var Caching = require('caching');

var showlist = require( "./eztv/showlist" );
var myshows = require( "./eztv/myshows" );


var app = module.exports = express.createServer();

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/showlist', showlist);
app.get('/myshows', myshows.index);
app.get('/myshows/list', myshows.list);

GLOBAL.cache = new Caching("memory");

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
