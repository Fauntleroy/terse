terse.Routers.Application = Backbone.Router.extend({

	routes: {
		'': 'home',
		'g/:id': 'home'
	},

	home: function( id ){

		terse.group = new terse.Models.Group({ id: id });

		if( terse.views.group ) terse.views.group.destroy();
		terse.views.group = new terse.Views.Group({
			model: terse.group
		});
		$('#application').html( terse.views.group.render().$el );

	}

});