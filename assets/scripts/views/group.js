terse.Views.Group = Backbone.View.extend({

	el: '#group',
	template: templates.group,

	initialize: function(){

		_( this ).bindAll( 'renderResult', 'changeHTML', 'changeCSS', 'changeJS' );

		this.listenTo( this.model, 'update', this.renderResult );

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

		this.html_editor = CodeMirror.fromTextArea( this.$html_textarea[0], { mode: 'htmlmixed' } );
		this.css_editor = CodeMirror.fromTextArea( this.$css_textarea[0], { mode: 'css' } );
		this.js_editor = CodeMirror.fromTextArea( this.$js_textarea[0], { mode: 'javascript' } );

		this.html_editor.on( 'change', this.changeHTML );
		this.css_editor.on( 'change', this.changeCSS );
		this.js_editor.on( 'change', this.changeJS );

		this.toolbar = new terse.Views.Toolbar({ el: '#toolbar', model: this.model });

		this.renderResult();

	},

	renderResult: function(){

		var html = this.html_editor.getValue();
		var css = this.css_editor.getValue();
		var js = this.js_editor.getValue();
		html = '<head><style>'+ css +'</style><script>'+ js +'</script></head><body>'+ html +'</body>';

		this.$result_iframe.contents().find('html').html( html ); 

	},

	changeHTML: function( cm, change ){
		
		var content = this.html_editor.getValue();

		this.model.updateFile( 'markup.html', content );

	},

	changeCSS: function( cm, change ){
		
		var content = this.css_editor.getValue();

		this.model.updateFile( 'style.css', content );

	},

	changeJS: function( cm, change ){
		
		var content = this.js_editor.getValue();

		this.model.updateFile( 'script.js', content );

	}

});