var _ = require('underscore');
var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
	urlRoot: 'https://api.github.com/gists',
	url: function( options ){
		options = options || {};
		// this is incredibly hacky
		// find a sensible way to handle access tokens with backbone
		var url = this.id ? ( this.urlRoot +'/'+ this.id ) : this.urlRoot;
		if( options.fork ) url += '/forks';
		if( this.user_data.access_token ) url +='?access_token='+ this.user_data.access_token;
		return url;
	},
	initialize: function( data, config ){
		config = config || {};
		this.user_data = config.user_data || {};
		if( this.id ) this.fetch();
	}
});