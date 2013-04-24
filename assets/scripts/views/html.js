terse.Views.HTML = Backbone.View.extend({

	template: terse.templates.html,

	initialize: function(){

		this.render();

	},

	render: function(){

		var html = this.template( this.model.toJSON() );
		var $html = $.parseHTML( html );
		this.$el.html( $html );

		this.$textarea = this.$el.find('textarea');

		this.editor = CodeMirror.fromTextArea( this.$textarea[0] );

	}

});