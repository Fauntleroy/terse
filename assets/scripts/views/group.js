terse.Views.Group = Backbone.View.extend({

	el: '#group',
	template: templates.group,

	initialize: function(){

		this.render();

	},

	render: function(){

		var html = this.template( this.model.toJSON() );
		var $group = $.parseHTML( html );
		this.$el.html( $group );

		this.$html = $('#html');
		this.$html_textarea = this.$html.find('textarea');
		this.$css = $('#css');
		this.$css_textarea = this.$css.find('textarea');
		this.$js = $('#js');
		this.$js_textarea = this.$js.find('textarea');
		this.$result = $('#result');
		this.$result_iframe = this.$result.find('iframe');

		CodeMirror.fromTextArea( this.$html_textarea[0] );
		CodeMirror.fromTextArea( this.$css_textarea[0] );
		CodeMirror.fromTextArea( this.$js_textarea[0] );

		this.toolbar = new terse.Views.Toolbar({ el: '#toolbar', model: this.model });

	}

});