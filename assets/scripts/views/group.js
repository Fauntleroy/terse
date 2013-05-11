terse.Views.Group = Backbone.View.extend({

	template: terse.templates.group,

	events: {
		'click ul.nav-tabs li a': 'clickTab'
	},

	initialize: function(){

		_( this ).bindAll( 'render', 'destroy' );

	},

	render: function(){

		var html = this.template( this.model.toJSON() );
		var $group = $.parseHTML( html );
		this.$el.replaceWith( $group );
		this.setElement( $group );

		this.$metadata = this.$('#metadata');
		this.$toolbar = this.$('#toolbar');
		this.$html = this.$('#html');
		this.$css = this.$('#css');
		this.$js = this.$('#js');
		this.$result = this.$('#result');

		this.metadata = new terse.Views.Metadata({ model: this.model });
		this.toolbar = new terse.Views.Toolbar({ model: this.model });
		this.html = new terse.Views.HTML({ model: this.model });
		this.css = new terse.Views.CSS({ model: this.model });
		this.js = new terse.Views.JS({ model: this.model });
		this.result = new terse.Views.Result({ model: this.model });

		this.$metadata.replaceWith( this.metadata.render().$el );
		this.$toolbar.replaceWith( this.toolbar.render().$el );
		this.$html.replaceWith( this.html.render().$el );
		this.$css.replaceWith( this.css.render().$el );
		this.$js.replaceWith( this.js.render().$el );
		this.$result.replaceWith( this.result.render().$el );

		return this;

	},

	// Change the active tab
	clickTab: function( e ){

		e.preventDefault();
		$(e.target).tab('show');
		// hack to fix editors that are always collapsed on load
		this.html.editor.refresh();
		this.css.editor.refresh();
		this.js.editor.refresh();

	},

	// Completely remove this view and its children
	// geez... that sounds cruel
	destroy: function(){

		this.toolbar.remove();
		this.html.remove();
		this.css.remove();
		this.js.remove();
		//this.result.remove();
		this.remove();

	}

});