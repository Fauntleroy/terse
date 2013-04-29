terse.Views.Group = Backbone.View.extend({

	el: '#group',
	template: terse.templates.group,

	events: {
		'click ul.nav-tabs li a': 'clickTab'
	},

	initialize: function(){

		_( this ).bindAll( 'render' );

		this.render();

	},

	render: function(){

		var html = this.template( this.model.toJSON() );
		var $group = $.parseHTML( html );
		this.$el.replaceWith( $group );
		this.setElement( $group );

		return this;

	},

	// Change the active tab
	clickTab: function( e ){

		e.preventDefault();
		$(e.target).tab('show');
		// hack to fix editors that are always collapsed on load
		terse.views.html.editor.refresh();
		terse.views.css.editor.refresh();
		terse.views.js.editor.refresh();

	}

});