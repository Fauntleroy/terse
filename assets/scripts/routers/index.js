terse.Routers.Application = Backbone.Router.extend({

	routes: {
		'': 'home',
		'g/:id': 'home'
	},

	home: function( id ){

		terse.group = new terse.Models.Group({ id: id });

		terse.views.group = terse.views.group || new terse.Views.Group({ model: terse.group });
		terse.views.toolbar = terse.views.toolbar || new terse.Views.Toolbar({ model: terse.group });
		terse.views.html = terse.views.html || new terse.Views.HTML({ model: terse.group });
		terse.views.css = terse.views.css || new terse.Views.CSS({ model: terse.group });
		terse.views.js = terse.views.js || new terse.Views.JS({ model: terse.group });
		terse.views.result = terse.views.result || new terse.Views.Result({ model: terse.group });

	}

});