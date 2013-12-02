var _ = require('underscore');
var Backbone = require('backbone');

var ANONYMOUS_USER_AVATAR = 'https://i2.wp.com/a248.e.akamai.net/assets.github.com/images/gravatars/gravatar-user-420.png?ssl=1';
var ANONYMOUS_USER_LOGIN = 'Anonymous';

module.exports = Backbone.Model.extend({
	defaults: {
		comments: 0,
		forks: [],
		user: {
			login: ANONYMOUS_USER_LOGIN,
			avatar_url: ANONYMOUS_USER_AVATAR
		}
	},
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
	},
	isOwnedBy: function( username ){
		var gist_user = this.get('user') || {};
		return ( gist_user.login === username && !!gist_user.login );
	},
	isForkable: function(){
		return ( !!this.id && !!terse.user_data.username && !this.isOwnedBy( terse.user_data.username ) );
	},
	// save the gist
	save: function(){
		// PATCH update existing Gist that user owns
		if( this.isOwnedBy( this.user_data.username ) && this.id ){
			var gist_data = this.toJSON();
			var save_data = _.pick( gist_data, 'description', 'files' );
			for( var filename in save_data.files ){
				save_data.files[filename] = _.pick( save_data.files[filename], 'content' );
			}
			Backbone.Model.prototype.save.call( this, save_data, {
				patch: true
			});
		}
		// Fork when not anonymous and not new
		else if( this.isForkable() ){
			this.fork();
		}
		// POST new Gist
		else {
			this.id = null; // hack. Forces Backbone to POST
			Backbone.Model.prototype.save.apply( this, arguments );
		}
	}
});