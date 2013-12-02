var _ = require('underscore');
var Backbone = require('backbone');
var $ = Backbone.$ = require('jquery');
var Handlebars = require('handlebars');
var handlebars_helper = require('handlebars-helper');
handlebars_helper.help( Handlebars );
var templates = require('../../compiled/templates.js')( Handlebars );

var VIEWABLE_TYPES = ['text/html'];

module.exports = Backbone.View.extend({
	template: templates.result,
	initialize: function(){
		_.bindAll( this, 'addFile', 'activeFile' );
		this.listenTo( this.model, 'reset', this.render );
		this.files = [];
		this.render();
	},
	render: function(){
		var json = this.model.toJSON();
		json.files = _.filter( json.files, function( file ){
			return _.contains( VIEWABLE_TYPES, file.type );
		});
		var html = this.template( json );
		this.$el.html( html );
		this.$frame = this.$('iframe');
		_.each( json.files, this.addFile );
	},
	addFile: function( file ){
		this.files.push( file );
		this.trigger( 'active', file );
		this.activeFile( file );
	},
	activeFile: function( file ){
		var iframe_doc = this.$frame.contents()[0];
		iframe_doc.open();
		iframe_doc.write( file.content );
		iframe_doc.close();
	}
});