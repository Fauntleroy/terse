var express = require('express');
var express_handlebars = require('express3-handlebars');

var router = express();
var handlebars = express_handlebars({
	extname: '.hbs',
	defaultLayout: 'layout',
	layoutsDir: 'views'
});

router.engine( 'hbs', handlebars );
router.set( 'view engine', 'hbs' );

router.get( '/', function( req, res ){

	res.render( 'index.hbs', {} );

});

router.listen( 8080 );