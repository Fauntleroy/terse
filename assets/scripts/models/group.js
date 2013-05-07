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

	defaults: {
		description: 'A terse gist',
		'public': true,
		files: {}
	},

	initialize: function(){

		_( this ).bindAll( 'isAnonymous', 'isOwnedBy', 'updateFile', 'updateURL', 'keySave', 'save', 'fork', 'triggerUpdate' );

		if( this.id ) this.fetch();

		this.on( 'change:id', this.updateURL );
		jwerty.key( 'ctrl+s/cmd+s', this.keySave );

	},

	// does the specified user own this
	isOwnedBy: function( user ){

		var gist_user = this.get('user') || {};
		return ( gist_user.login === user );

	},

	// does this Gist have an owner
	isAnonymous: function(){

		return ( !this.isNew() && !this.get('user') );

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
		else if( !this.isAnonymous() && this.id && terse.user_data.username ){
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
		$.post( fork_url, function( data, status, xhr ){
			gist.set( data );
		}, 'json' );

	},

	triggerUpdate: function(){

		this.trigger('update');

	},

});