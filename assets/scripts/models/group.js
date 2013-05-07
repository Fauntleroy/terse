terse.Models.Group = Backbone.Model.extend({

	urlRoot: 'https://api.github.com/gists',

	url: function(){

		// this is incredibly hacky
		// find a sensible way to handle access tokens with backbone
		var url = ( this.id )
			? this.urlRoot +'/'+ this.id
			: this.urlRoot;

		if( terse.user_data.access_token ) url = url +'?access_token='+ terse.user_data.access_token;

		return url;

	},

	defaults: {
		description: 'A terse gist',
		'public': true,
		files: {}
	},

	initialize: function(){

		_( this ).bindAll( 'isAnonymous', 'isOwnedBy', 'updateFile', 'updateURL', 'keySave', 'saveFile', 'triggerUpdate' );

		var gist_id = this.get('gist_id');

		if( gist_id ) this.fetch({
			url: this.urlRoot +'/'+ gist_id
		});

		this.on( 'change:gist_id', this.updateURL );
		jwerty.key( 'ctrl+s/cmd+s', this.keySave );

	},

	// does the specified user own this
	isOwnedBy: function( user ){

		return this.get('user').login === user;

	},

	// does this Gist have an owner
	isAnonymous: function(){

		if( this.isNew() ) return false;
		return ( !this.get('user') );

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

		this.saveFile();
		return false;

	},

	// save the gist
	saveFile: function(){

		// PATCH when owned by user and has an ID
		if( this.isOwnedBy( terse.user_data.username ) && this.id ){
			var gist_data = this.toJSON();
			var new_gist_data = _( gist_data ).pick( 'description', 'files' );
			for( var filename in new_gist_data.files ){
				new_gist_data.files[filename] = _(new_gist_data.files[filename]).pick('content');
			}
			this.save( new_gist_data, {
				patch: true
			});
		}
		// else POST
		else {
			this.id = null; // hack. Forces Backbone to POST
			this.save();
		}

	},

	triggerUpdate: function(){

		this.trigger('update');

	},

});