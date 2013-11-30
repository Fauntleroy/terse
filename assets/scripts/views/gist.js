var _ = require('underscore');
var Backbone = require('backbone');
var $ = Backbone.$ = require('jquery');
var Handlebars = require('handlebars');
var templates = require('../../compiled/templates.js')( Handlebars );

module.exports = Backbone.View.extend({
	template: templates.gist,
	initialize: function(){
		this.render();
	},
	render: function(){
		var html = this.template()
	}
});