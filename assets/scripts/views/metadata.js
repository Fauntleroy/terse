terse.Views.Metadata = Backbone.View.extend({

	template: terse.templates.metadata,

	events: {
		'change [name=title]': 'updateTitle'
	},

	initialize: function(){

		_( this ).bindAll( 'render', 'updateTitle' );

		this.listenTo( this.model, 'change:user change:html_url', this.render );

	},

	render: function(){

		var html = this.template( this.model.toJSON() );
		var $metadata = $.parseHTML( html );
		this.$el.replaceWith( $metadata );
		this.setElement( $metadata );

		this.$title = this.$('[name=title]');

		return this;

	},

	updateTitle: function( e ){

		var title = this.$title.val();
		this.model.set( 'title', title );

	}

});