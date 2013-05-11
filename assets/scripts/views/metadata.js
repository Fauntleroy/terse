terse.Views.Metadata = Backbone.View.extend({

	template: terse.templates.metadata,

	events: {
		'change [name=description]': 'updateDescription'
	},

	initialize: function(){

		_( this ).bindAll( 'render', 'updateDescription', 'renderDescription' );

		this.listenTo( this.model, 'change:user change:html_url', this.render );
		this.listenTo( this.model, 'change:description', this.renderDescription );

	},

	render: function(){

		var html = this.template( this.model.toJSON() );
		var $metadata = $.parseHTML( html );
		this.$el.replaceWith( $metadata );
		this.setElement( $metadata );

		this.$description = this.$('[name=description]');

		return this;

	},

	renderDescription: function( model, description ){

		var old_description = this.$description.val();
		if( description !== old_description ) this.$description.val( description );

	},

	updateDescription: function(){

		var description = this.$description.val();
		this.model.set( 'description', description );

	}

});