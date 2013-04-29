terse.Views.Result = Backbone.View.extend({

	el: '#result',
	template: terse.templates.result,

	initialize: function(){

		_( this ).bindAll( 'render', 'update' );

		this.render();

		this.listenTo( this.model, 'update sync', this.update );

	},

	render: function(){

		var html = this.template( this.model.toJSON() );
		var $html = $.parseHTML( html );
		this.$el.replaceWith( $html );
		this.setElement( $html );

		this.$iframe = this.$el.find('iframe');

		this.update();

		return this;

	},

	// Update the contents of the result iframe
	update: function(){

		var files = this.model.get('files');
		var html = ( files['markup.html'] )? files['markup.html'].content: '';
		var css = ( files['style.css'] )? files['style.css'].content: '';
		var js = ( files['script.js'] )? files['script.js'].content: '';
		var iframe_content = '<head><style>'+ css +'</style></head><body>'+ html +'<script>'+ js +'</script></body>';
		var iframe_doc = this.$iframe.contents()[0];

		iframe_doc.open();
		iframe_doc.write( iframe_content );
		iframe_doc.close(); 

	}

});