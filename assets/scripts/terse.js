/*
Terse Module
This is the base that includes all submodules and initializes the application
*/

var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery');

// set up namespace
var terse = window.terse = window.terse || {};

// Models and Collections


$(function(){
	// start mediator for event transmission
	var mediator = terse.mediator = _.extend( {}, Backbone.Events );
	// initialize models and collections
	terse.gist = {};
	terse.views = {
		gist: {}
	};
});