terse.Routers.Application = Backbone.Router.extend({

	routes: {
		'': 'home'
	},

	home: function(){

		terse.group = new terse.Models.Group;

		terse.views.application = new terse.Views.Application;
		terse.views.group = new terse.Views.Group({ model: terse.group });

	}

});