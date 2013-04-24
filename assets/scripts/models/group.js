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

	parse: function( response ){

		response.gist_id = response.id;

		// ensure we don't try to PATCH anonymous gists
		if( !terse.user_data.access_token )	response.id = null;

		return response;

	},

	initialize: function(){

		_( this ).bindAll( 'isAnonymous', 'updateFile', 'updateURL', 'keySave', 'saveFile', 'triggerUpdate' );

		var gist_id = this.get('gist_id');

		if( gist_id ) this.fetch({
			url: this.urlRoot +'/'+ gist_id
		});

		this.on( 'change:gist_id', this.updateURL );
		jwerty.key( 'ctrl+s/cmd+s', this.keySave );

	},

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

	saveFile: function(){

		if( this.isNew() || this.isAnonymous() ){
			this.save();
		}
		else {
			var clean_save_data = _(this.toJSON()).pick( 'description', 'files' );
			for( var filename in clean_save_data.files ){
				clean_save_data.files[filename] = _(clean_save_data.files[filename]).pick('content');
			}
			this.save( clean_save_data, {
				patch: true
			});
		}

	},

	triggerUpdate: function(){

		this.trigger('update');

	},

});