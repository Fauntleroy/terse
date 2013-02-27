terse.Models.Group = Backbone.Model.extend({

	urlRoot: 'https://api.github.com/gists',

	defaults: function(){

		var datetime_str = Date.now().toString();

		var init = {
			description: 'A terse gist',
			'public': true,
			files: {}
		};
		init.files[datetime_str +'.html'] = {
			content: 'test'
		};
		init.files[datetime_str +'.css'] = {
			content: 'test'
		};
		init.files[datetime_str +'.js'] = {
			content: 'test'
		};

		return init;

	},

	initialize: function(){

	}

});