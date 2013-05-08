terse.Views.Toolbar = Backbone.View.extend({

	el: '#toolbar',
	template: terse.templates.toolbar,

	events: {
		'click #update': 'clickUpdate',
		'click #save': 'clickSave'
	},

	initialize: function(){

		_(this).bindAll( 'render', 'renderURL', 'clickUpdate', 'clickSave' );

		this.listenTo( this.model, 'change:html_url sync', this.render );

		this.render();

	},

	render: function(){

		var gist_data = this.model.toJSON();
		gist_data.forkable = this.model.isForkable(); // for the save/fork button
		var html = this.template( gist_data );
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

		this.model.save();

	}

});