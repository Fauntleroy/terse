terse.Views.JS = Backbone.View.extend({

	el: '#js',
	template: terse.templates.js,

	initialize: function(){

		_( this ).bindAll( 'render', 'updateModel', 'updateEditor' );

		this.render();

		this.listenTo( this.model, 'sync', this.updateEditor );
		this.editor.on( 'change', this.updateModel );

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

		return this;

	},

	// Update the model's data with the editor's contents
	updateModel: function( cm, change ){
		
		var content = this.editor.getValue();

		this.model.updateFile( 'script.js', content );

	},

	// Update the contents of the editor with model data
	updateEditor: function(){

		var files = this.model.get('files');
		var js = ( files['script.js'] )? files['script.js'].content: '';
		var editor_contents = this.editor.getValue();

		if( js !== editor_contents ) this.editor.setValue( js );

	}

});