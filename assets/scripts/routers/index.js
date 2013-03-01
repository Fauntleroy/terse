terse.Routers.Application = Backbone.Router.extend({

	routes: {
		'': 'home',
		'g/:id': 'home'
	},

	home: function( id ){

		terse.group = new terse.Models.Group({ gist_id: id });

		terse.views.application = new terse.Views.Application;
		terse.views.group = new terse.Views.Group({ model: terse.group });

	}

});