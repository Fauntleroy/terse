terse.Views.Toolbar = Backbone.View.extend({

	template: templates.toolbar,

	events: {
		'click #update': 'clickUpdate',
		'click #save': 'clickSave'
	},

	initialize: function(){

		_(this).bindAll( 'renderURL', 'clickUpdate', 'clickSave' );

		this.listenTo( this.model, 'change:html_url', this.renderURL );

		this.render();

	},

	render: function(){

		var html = this.template( this.model.toJSON() );
		var $toolbar = $.parseHTML( html );
		this.$el.html( $toolbar );

		this.$gist_link = $('#link');

	},

	renderURL: function( group, url ){

		this.$gist_link.attr( 'href', url ).text( url );

	},

	clickUpdate: function( e ){

		e.preventDefault();

		this.model.triggerUpdate();

	},

	clickSave: function( e ){

		e.preventDefault();

		this.model.saveFile();

	}

});