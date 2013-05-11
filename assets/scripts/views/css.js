terse.Views.CSS = Backbone.View.extend({

	template: terse.templates.css,

	initialize: function(){

		_( this ).bindAll( 'render', 'show', 'hide', 'updateModel', 'updateEditor' );

		this.listenTo( this.model, 'sync', this.updateEditor );

	},

	render: function(){

		var editor_defaults = {
			mode: 'css',
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

	// show the view
	show: function(){

		this.$el.show();
		this.editor.refresh();

	},

	// hide the view
	hide: function(){

		this.$el.hide();

	},

	// Update the model's data with the editor's contents
	updateModel: function( cm, change ){
		
		var content = this.editor.getValue();

		this.model.updateFile( 'style.css', content );

	},

	// Update the contents of the editor with model data
	updateEditor: function(){

		var files = this.model.get('files');
		var css = ( files['style.css'] )? files['style.css'].content: '';
		var editor_contents = this.editor.getValue();

		if( css !== editor_contents ) this.editor.setValue( css );

	}

});