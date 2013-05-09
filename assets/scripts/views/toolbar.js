terse.Views.Toolbar = Backbone.View.extend({

	template: terse.templates.toolbar,

	events: {
		'click #update': 'clickUpdate',
		'click #save': 'clickSave'
	},

	initialize: function(){

		_(this).bindAll( 'clickUpdate', 'clickSave', 'disableSave', 'enableSave' );

		this.listenTo( this.model, 'change:html_url sync', this.render );
		this.listenTo( this.model, 'request', this.disableSave );
		this.listenTo( this.model, 'sync', this.enableSave );

	},

	render: function(){

		var gist_data = this.model.toJSON();
		gist_data.forkable = this.model.isForkable(); // for the save/fork button
		var html = this.template( gist_data );
		var $toolbar = $.parseHTML( html );
		this.$el.replaceWith( $toolbar );
		this.setElement( $toolbar );

		this.$gist_link = this.$el.find('#link');
		this.$save = this.$el.find('#save');

		return this;

	},

	clickUpdate: function( e ){

		e.preventDefault();

		this.model.triggerUpdate();

	},

	clickSave: function( e ){

		e.preventDefault();

		this.model.save();

	},

	// disable the save/fork button
	disableSave: function(){

		this.$save.prop( 'disabled', true );

	},

	// enable the save/fork button
	enableSave: function(){

		this.$save.prop( 'disabled', false );

	}

});