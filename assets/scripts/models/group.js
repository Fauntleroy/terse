terse.Models.Group = Backbone.Model.extend({

	urlRoot: 'https://api.github.com/gists',

	defaults: {
		description: 'A terse gist',
		'public': true,
		files: {}
	},

	parse: function( response ){

		// ensure we don't try to PATCH anonymous gists
		if( !response.user ){
			response.gist_id = response.id;
			response.id = null;
		}

		return response;

	},

	initialize: function(){

		_( this ).bindAll( 'isAnonymous', 'updateFile', 'saveFile', 'triggerUpdate' );

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

	saveFile: function(){

		if( this.isNew() || this.isAnonymous() ){
			this.save();
		}
		else {
			var clean_save_data = _(this.toJSON()).pick( 'description', 'files' );
			for( var filename in clean_save_data.files ){
				clean_save_data.files[filename] = _(clean_save_data.files[filename]).pick('content');
			}
			this.save( clean_save_data, { patch: true } );
		}

	},

	triggerUpdate: function(){

		this.trigger('update');

	},

});