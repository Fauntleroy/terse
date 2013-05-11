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

		this.metadata = new terse.Views.Metadata({ model: this.model });
		this.toolbar = new terse.Views.Toolbar({ model: this.model });
		this.html = new terse.Views.HTML({ model: this.model });
		this.css = new terse.Views.CSS({ model: this.model });
		this.js = new terse.Views.JS({ model: this.model });
		this.result = new terse.Views.Result({ model: this.model });

		this.$metadata = this.$('#metadata').replaceWith( this.metadata.render().$el );
		this.$toolbar = this.$('#toolbar').replaceWith( this.toolbar.render().$el );
		this.$html = this.$('#html').replaceWith( this.html.render().$el );
		this.$css = this.$('#css').replaceWith( this.css.render().$el );
		this.$js = this.$('#js').replaceWith( this.js.render().$el );
		this.$result = this.$('#result').replaceWith( this.result.render().$el );

		this.html.show();
		this.css.hide();
		this.js.hide();

		return this;

	},

	// Change the active tab
	clickTab: function( e ){

		e.preventDefault();
		var $tab = $(e.target);
		var tab = $tab.attr('href').slice(1);
		var view = this[tab];

		this.html.hide();
		this.css.hide();
		this.js.hide();
		view.show();

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