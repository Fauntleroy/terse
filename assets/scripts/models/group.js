var ANONYMOUS_USER_AVATAR = 'https://i2.wp.com/a248.e.akamai.net/assets.github.com/images/gravatars/gravatar-user-420.png?ssl=1';
var ANONYMOUS_USER_LOGIN = 'Anonymous';

terse.Models.Group = Backbone.Model.extend({

	urlRoot: 'https://api.github.com/gists',

	url: function( options ){

		options = options || {};

		// this is incredibly hacky
		// find a sensible way to handle access tokens with backbone
		var url = ( this.id )
			? this.urlRoot +'/'+ this.id
			: this.urlRoot;

		if( options.fork ) url += '/forks';
		if( terse.user_data.access_token ) url +='?access_token='+ terse.user_data.access_token;

		return url;

	},

	parse: function( data ){

		var filenames = _( data.files ).keys();
		var title = /(.+)\.[a-z0-9]+$/i.exec( filenames[0] ) || [];
		data.title = title[1];
		data.user = data.user || {
			login: ANONYMOUS_USER_LOGIN,
			avatar_url: ANONYMOUS_USER_AVATAR
		};

		return data;

	},

	defaults: {
		description: 'A terse gist',
		'public': true,
		files: {},
		user: {
			avatar_url: terse.user_data.avatar || ANONYMOUS_USER_AVATAR,
			login: terse.user_data.username || ANONYMOUS_USER_LOGIN,
			html_url: terse.user_data.profile
		}
	},

	initialize: function(){

		_( this ).bindAll( 'isAnonymous', 'isOwnedBy', 'isForkable', 'updateFilenames', 'updateFile', 'updateURL', 'keySave', 'save', 'fork', 'triggerUpdate', 'postDestroy' );

		if( this.id ) this.fetch();

		this.on( 'change:id', this.updateURL );
		this.on( 'change:title', this.updateFilenames );
		this.on( 'destroy', this.postDestroy );
		jwerty.key( 'ctrl+s/cmd+s', this.keySave );

	},

	// does the specified user own this
	isOwnedBy: function( user ){

		var gist_user = this.get('user') || {};
		return ( gist_user.login === user && !!gist_user.login );

	},

	// does this Gist have an owner
	isAnonymous: function(){

		return ( this.id && !this.get('user') );

	},

	// can this Gist be forked?
	isForkable: function(){

		return ( !!this.id && !!terse.user_data.username && !this.isOwnedBy( terse.user_data.username ) );

	},

	// "rename" the gist's files when the title changes
	updateFilenames: function( group, title ){

		var files = this.get('files');
		_( files ).each( function( value, key ){
			var extension = /\..+$/i.exec( key )[0];
			if( files[title + extension] === value ) return;
			files[title + extension] = value;
			delete files[key];
		});
		this.set( 'files', files );

	},

	updateFile: function( file, content ){

		var files_object = this.get('files');
		files_object[file] = files_object[file] || {};
		files_object[file].content = content;
		this.set( 'files', files_object );
		this.trigger('change:files');

	},

	updateURL: function( group, gist_id ){

		terse.routers.application.navigate( '/g/'+ gist_id );

	},

	// save when ctrl+s/cmd+s is pressed
	keySave: function(){

		this.save();
		return false;

	},

	// save the gist
	save: function(){

		// PATCH when owned by user and has an ID
		if( this.isOwnedBy( terse.user_data.username ) && this.id ){
			var gist_data = this.toJSON();
			var new_gist_data = _( gist_data ).pick( 'description', 'files' );
			for( var filename in new_gist_data.files ){
				new_gist_data.files[filename] = _(new_gist_data.files[filename]).pick('content');
			}
			Backbone.Model.prototype.save.call( this, new_gist_data, {
				patch: true
			});
		}
		// Fork when not anonymous and not new
		else if( this.isForkable() ){
			this.fork();
		}
		// else POST
		else {
			this.id = null; // hack. Forces Backbone to POST
			Backbone.Model.prototype.save.apply( this, arguments );
		}

	},

	fork: function(){

		var gist = this;
		var fork_url = this.url({ fork: true });
		var xhr = $.post( fork_url, function( data, status, xhr ){
			terse.routers.application.navigate( '/g/'+ data.id, {
				trigger: true
			});
		}, 'json' );
		gist.trigger( 'request', gist, xhr, {} );

	},

	triggerUpdate: function(){

		this.trigger('update');

	},

	postDestroy: function(){

		terse.routers.application.navigate( '/new', {
			trigger: true
		});

	}

});