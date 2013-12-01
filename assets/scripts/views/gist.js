var _ = require('underscore');
var Backbone = require('backbone');
var $ = Backbone.$ = require('jquery');
var Handlebars = require('handlebars');
var handlebars_helper = require('handlebars-helper');
handlebars_helper.help( Handlebars );
var templates = require('../../compiled/templates.js')( Handlebars );

module.exports = Backbone.View.extend({
	template: templates.gist,
	initialize: function(){
		this.listenTo( this.model, 'change', this.render );
		this.render();
	},
	render: function(){
		var html = this.template( this.model.toJSON() );
		this.$el.html( html );
	}
});