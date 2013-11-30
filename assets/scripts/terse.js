/*
Terse Module
This is the base that includes all submodules and initializes the application
*/

var Backbone = require('backbone');

// set up namespace
var terse = window.terse = window.terse || {};

// Router
var Router = require('./routers/index.js');

// initialize router
terse.router = new Router;
Backbone.history.start({
	pushState: true
});