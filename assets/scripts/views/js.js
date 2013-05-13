terse.Views.JS = Backbone.View.extend({

	template: terse.templates.js,

	initialize: function(){

		_( this ).bindAll( 'render', 'updateModel', 'updateEditor' );

		this.listenTo( this.model, 'sync', this.updateEditor );

	},

	render: function(){

		var editor_defaults = {
			mode: 'javascript',
			lineNumbers: true,
			indentUnit: 4,
			indentWithTabs: true
		};
		var html = this.template( this.model.toJSON() );
		var $html = $.parseHTML( html );
		this.$el.replaceWith( $html );
		this.setElement( $html );

		this.$textarea = this.$el.find('textarea');

		this.editor = CodeMirror.fromTextArea( this.$textarea[0], editor_defaults );

		this.editor.on( 'change', this.updateModel );

		return this;

	},

	// Update the model's data with the editor's contents
	updateModel: function( cm, change ){
		
		var filename = this.model.get('title') +'.js';
		var content = this.editor.getValue();

		this.model.updateFile( filename, content );

	},

	// Update the contents of the editor with model data
	updateEditor: function(){

		var filename = this.model.get('title') +'.js';
		var files = this.model.get('files');
		var js = ( files[filename] )? files[filename].content: '';
		var editor_contents = this.editor.getValue();

		if( js !== editor_contents ) this.editor.setValue( js );

	}

});