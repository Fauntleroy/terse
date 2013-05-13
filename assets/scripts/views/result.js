terse.Views.Result = Backbone.View.extend({

	template: terse.templates.result,

	initialize: function(){

		_( this ).bindAll( 'render', 'update' );

		this.listenTo( this.model, 'update sync', this.update );

	},

	render: function(){

		var html = this.template( this.model.toJSON() );
		var $html = $.parseHTML( html );
		this.$el.replaceWith( $html );
		this.setElement( $html );

		this.$iframe = this.$el.find('iframe');

		return this;

	},

	// Update the contents of the result iframe
	update: function(){

		var html = '', css = '', js = '';
		var extension_regex = /\.[a-z0-9]+$/i;
		var files = this.model.get('files');
		_( files ).each( function( value, key ){
			var extension = extension_regex.exec( key ) || [];
			extension = extension[0];
			if( extension === '.html' ) html = value.content;
			else if( extension === '.css' ) css = value.content;
			else if( extension === '.js' ) js = value.content;
		});
		var iframe_content = '<head><style>'+ css +'</style></head><body>'+ html +'<script>'+ js +'</script></body>';
		var iframe_doc = this.$iframe.contents()[0];

		iframe_doc.open();
		iframe_doc.write( iframe_content );
		iframe_doc.close(); 

	}

});