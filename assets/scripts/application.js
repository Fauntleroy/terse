// Add global EventEmitter
_.extend( terse, Backbone.Events );

// Start the router
$(function(){

	terse.routers.application = new terse.Routers.Application;
	Backbone.history.start({
		pushState: true
	});

});