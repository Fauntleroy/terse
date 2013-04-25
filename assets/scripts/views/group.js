terse.Views.Group = Backbone.View.extend({

	el: '#group',
	template: terse.templates.group,

	events: {
		'click ul.nav-tabs li a': 'clickTab'
	},

	initialize: function(){

		_( this ).bindAll( 'renderResult', 'updateFiles', 'changeHTML', 'changeCSS', 'changeJS' );

		this.listenTo( this.model, 'update', this.renderResult );
		this.listenTo( this.model, 'sync', this.updateFiles );

		this.render();

	},

	render: function(){

		var editor_defaults = {
			lineNumbers: true,
			indentUnit: 4,
			indentWithTabs: true
		};
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

		this.html_editor = CodeMirror.fromTextArea(
			this.$html_textarea[0],
			_({ mode: 'htmlmixed' }).defaults( editor_defaults )
		);
		this.css_editor = CodeMirror.fromTextArea(
			this.$css_textarea[0],
			_({ mode: 'css' }).defaults( editor_defaults )
		);
		this.js_editor = CodeMirror.fromTextArea(
			this.$js_textarea[0], 
			_({	mode: 'javascript' }).defaults( editor_defaults )
		);

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
		html = '<head><style>'+ css +'</style></head><body>'+ html +'<script>'+ js +'</script></body>';
		var result_doc = this.$result_iframe[0].contentDocument;

		result_doc.open();
		result_doc.write( html );
		result_doc.close(); 

	},

	updateFiles: function(){

		var files = this.model.get('files');

		var html = this.html_editor.getValue();
		var css = this.css_editor.getValue();
		var js = this.js_editor.getValue();
		var new_html = ( files['markup.html'] || {} ).content;
		var new_css = ( files['style.css'] || {} ).content;
		var new_js = ( files['script.js'] || {} ).content;

		if( new_html && html !== new_html ) this.html_editor.setValue( new_html );
		if( new_css && css !== new_css ) this.css_editor.setValue( new_css );
		if( new_js && js !== new_js ) this.js_editor.setValue( new_js );

		this.renderResult();

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

	},

	clickTab: function( e ){

		e.preventDefault();
		$(e.target).tab('show');
		// hack to fix editors that are always collapsed on load
		this.html_editor.refresh();
		this.css_editor.refresh();
		this.js_editor.refresh();

	}

});