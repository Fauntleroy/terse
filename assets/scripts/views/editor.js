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
	initialize: function(){
		_.bindAll( this, 'addDoc' );
		this.listenTo( this.model, 'change:files', this.render );
		this.files = [];
		this.render();
	},
	render: function(){
		var files = this.model.get('files');
		var html = this.template( this.model.toJSON() );
		this.$el.html( html );
		this.$editor = this.$('.editor');
		this.editor = CodeMirror.fromTextArea( this.$editor[0], {
			lineNumbers: true,
			lineWrapping: true,
			indentUnit: 4,
			indentWithTabs: true
		});
		_.each( files, this.addDoc );
	},
	addDoc: function( file ){
		var doc = CodeMirror.Doc( file.content, TYPES_TO_MODES[file.type] );
		this.files.push({
			filename: file.filename,
			doc: doc
		});
		this.editor.swapDoc( doc );
	}
});