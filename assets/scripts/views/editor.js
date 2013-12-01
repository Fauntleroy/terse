var _ = require('underscore');
var Backbone = require('backbone');
var $ = Backbone.$ = require('jquery');
var CodeMirror = require('codemirror');
require('codemirror-mode-javascript');
require('codemirror-mode-css');
require('codemirror-mode-xml');
require('codemirror-mode-htmlmixed');
var Handlebars = require('handlebars');
var handlebars_helper = require('handlebars-helper');
handlebars_helper.help( Handlebars );
var templates = require('../../compiled/templates.js')( Handlebars );

const TYPES_TO_MODES = {
	'text/javascript': 'javascript',
	'text/css': 'css',
	'text/html': 'htmlmixed'
};

module.exports = Backbone.View.extend({
	template: templates.editor,
	events: {
		'click .listing a[href="#file"]': 'clickFile'
	},
	initialize: function(){
		_.bindAll( this, 'addFile', 'activeFile', 'clickFile' );
		this.listenTo( this.model, 'reset', this.render );
		this.files = [];
		this.render();
	},
	render: function(){
		var files = this.model.get('files');
		var html = this.template( this.model.toJSON() );
		this.$el.html( html );
		this.$listing = this.$('.listing');
		this.$editor = this.$('.editor');
		this.editor = CodeMirror.fromTextArea( this.$editor[0], {
			lineNumbers: true,
			lineWrapping: true,
			indentUnit: 4,
			indentWithTabs: true
		});
		_.each( files, this.addFile );
	},
	addFile: function( file ){
		var doc = CodeMirror.Doc( file.content, TYPES_TO_MODES[file.type] );
		var file = {
			filename: file.filename,
			doc: doc
		};
		this.files.push( file );
		this.trigger( 'active', file );
		this.activeFile( file );
	},
	activeFile: function( file ){
		if( typeof file === 'string' ){
			file = _.findWhere( this.files, {
				filename: file
			});
			if( !file ) return;
		}
		this.editor.swapDoc( file.doc );
		this.$listing
			.children('li[data-filename="'+ file.filename +'"]').addClass('active')
			.siblings().removeClass('active');
	},
	clickFile: function( e ){
		e.preventDefault();
		var $file_link = $( e.currentTarget );
		var $file_listing = $file_link.closest('li');
		var filename = $file_listing.data('filename');
		this.activeFile( filename );
	}
});