var express = require('express');
var express_handlebars = require('express3-handlebars');
var igneous = require('igneous');

var router = express();
var handlebars = express_handlebars({
	extname: '.hbs',
	defaultLayout: 'layout',
	layoutsDir: 'views'
});

router.engine( 'hbs', handlebars );
router.set( 'view engine', 'hbs' );

var igneous_middleware = igneous({
	root: __dirname +'/assets',
	minify: false,
	flows: [
		{
			route: 'styles/terse.css',
			type: 'css',
			base: 'styles',
			paths: [
				'vendor/bootstrap',
				'vendor/font-awesome',
				'vendor/codemirror',
				'terse.styl'
			]
		},
		{
			route: 'scripts/terse.js',
			type: 'js',
			base: 'scripts',
			paths: [
				'vendor/jquery',
				'vendor/bootstrap',
				'vendor/underscore',
				'vendor/backbone',
				'vendor/handlebars',
				'terse.js',
				'models',
				'collections',
				'views',
				'routers',
				'application.js'
			]
		},
		{
			route: 'templates/terse.js',
			type: 'jst',
			jst_lang: 'handlebars',
			jst_namespace: 'templates',
			base: 'templates',
			paths: ['/']
		}
	]
});

router.use( igneous_middleware );
router.use( express.static( __dirname + '/assets' ) );

router.get( '/', function( req, res ){

	res.render( 'index.hbs', {} );

});

router.listen( 8080 );