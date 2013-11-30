var _ = require('underscore');
var Backbone = require('backbone');
var $ = Backbone.$ = require('jquery');
var Gist = require('../models/gist.js');

// set up namespace
var terse = window.terse = window.terse || {};

// start mediator for event transmission
var mediator = terse.mediator = _.extend( {}, Backbone.Events );

module.exports = Backbone.Router.extend({
	routes: {
		'': 'home',
		'g/:id': 'home',
		'new': 'home'
	},
	home: function( id ){
		// initialize models and collections
		terse.gist = new Gist({
			id: id
		});
		terse.views = {
			gist: {}
		};
	}
});