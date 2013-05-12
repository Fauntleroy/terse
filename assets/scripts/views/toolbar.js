terse.Views.Toolbar = Backbone.View.extend({

	template: terse.templates.toolbar,

	events: {
		'click #update': 'clickUpdate',
		'click #save': 'clickSave',
		'click #delete': 'clickDelete',
		'click #privacy': 'clickPrivacy'
	},

	initialize: function(){

		_(this).bindAll( 'clickUpdate', 'clickSave', 'disableSave', 'enableSave' );

		this.listenTo( this.model, 'change:html_url change:public sync', this.render );
		this.listenTo( this.model, 'request', this.disableSave );
		this.listenTo( this.model, 'sync', this.enableSave );

	},

	render: function(){

		var gist_data = this.model.toJSON();
		gist_data.forkable = this.model.isForkable(); // for the save/fork button
		gist_data.deletable = this.model.isOwnedBy( terse.user_data.username ) && this.model.id; // for the delete button
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

	clickDelete: function( e ){

		e.preventDefault();

		var result = confirm('Are you sure you want to delete this Gist? This cannot be undone.');

		if( result ) this.model.destroy();

	},

	clickPrivacy: function( e ){

		e.preventDefault();

		var is_public = this.model.get('public');
		this.model.set( 'public', !is_public );

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