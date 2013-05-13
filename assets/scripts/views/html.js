terse.Views.HTML = Backbone.View.extend({

	template: terse.templates.html,

	initialize: function(){

		_( this ).bindAll( 'render', 'updateModel', 'updateEditor' );

		this.listenTo( this.model, 'sync', this.updateEditor );

	},

	render: function(){

		var editor_defaults = {
			mode: 'htmlmixed',
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
		
		var content = this.editor.getValue();
		var filename = this.model.get('title') +'.html';

		this.model.updateFile( filename, content );

	},

	// Update the contents of the editor with model data
	updateEditor: function(){

		var filename = this.model.get('title') +'.html';
		var files = this.model.get('files');
		var html = ( files[filename] )? files[filename].content: '';
		var editor_contents = this.editor.getValue();

		if( html !== editor_contents ) this.editor.setValue( html );

	}

});