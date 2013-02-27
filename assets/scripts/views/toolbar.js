terse.Views.Toolbar = Backbone.View.extend({

	template: templates.toolbar,

	events: {
		'click #save': 'saveGroup'
	},

	initialize: function(){

		_(this).bindAll( 'saveGroup' );

		this.render();

	},

	render: function(){

		var html = this.template( this.model.toJSON() );
		var $toolbar = $.parseHTML( html );
		this.$el.html( $toolbar );

	},

	saveGroup: function( e ){

		e.preventDefault();

		this.model.save();

	}

});