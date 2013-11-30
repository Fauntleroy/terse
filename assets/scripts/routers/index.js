var _ = require('underscore');
var Backbone = require('backbone');
var $ = Backbone.$ = require('jquery');

// models, views, collections
var Gist = require('../models/gist.js');
var GistView = require('../views/gist.js');

// set up namespace
var terse = window.terse = window.terse || {};

// start mediator for event transmission
var mediator = terse.mediator = _.extend( {}, Backbone.Events );

module.exports = Backbone.Router.extend({
	routes: {
		'': 'index',
		'g/:id': 'index',
		'new': 'index'
	},
	index: function( id ){
		// initialize models and collections
		terse.gist = new Gist({
			id: id
		}, {
			user_data: terse.user_data
		});
		// wait for DOM and initialize views
		$(function(){
			terse.views = {
				gist: new GistView({
					el: '#gist',
					model: terse.gist
				})
			};
		});
	}
});