var GITHUB_APP_ID = process.env.TERSE_GITHUB_APP_ID;
var GITHUB_APP_SECRET = process.env.TERSE_GITHUB_APP_SECRET;
var URL = process.env.TERSE_URL || 'http://terse.jit.su';
var REDIS_PORT = parseInt( process.env.TERSE_REDIS_PORT, 10 ) || 6379;
var REDIS_HOST = process.env.TERSE_REDIS_HOST || '127.0.0.1';
var REDIS_AUTH = process.env.TERSE_REDIS_AUTH;

var express = require('express');
var expose = require('express-expose');
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
				'vendor/codemirror/codemirror.js',
				'vendor/codemirror/modes',
				'vendor/handlebars',
				'terse.js',
				'models',
				'views',
				'routers',
				'application.js'
			]
		},
		{
			route: 'templates/terse.js',
			type: 'jst',
			extensions: ['hbs'],
			jst_lang: 'handlebars',
			jst_namespace: 'templates',
			base: 'templates',
			paths: ['/']
		}
	]
});

router.use( igneous_middleware );
router.use( express.static( __dirname + '/assets' ) );

//Passport stuff

var passport = require('passport');

router.use( express.cookieParser() );
router.use( express.bodyParser() );
router.use( express.session({
	secret: 'terseness is tersy'
}) );
router.use( passport.initialize() );
router.use( passport.session() );

var passport_github = require('passport-github');
var GithubStrategy = passport_github.Strategy;

passport.serializeUser( function( user, done ){
	done( null, user );
});

passport.deserializeUser( function( obj, done ){
	done( null, obj );
});

// Github login
passport.use( new GithubStrategy({
	clientID: GITHUB_APP_ID,
	clientSecret: GITHUB_APP_SECRET,
	callbackURL: URL +'/auth/github/callback'
}, function( access_token, refresh_token, profile, done ){

	var user = {
		username: profile.username,
		name: profile.displayName,
		profile: profile.profileUrl,
		emails: profile.emails,
		avatar: profile._json.avatar_url,
		access_token: access_token,
		refresh_token: refresh_token
	};
console.log(user);
	done( null, user );

}));

var github_auth_middleware = passport.authenticate( 'github', {
	successRedirect: '/',
	failureRedirect: '/login'
});

router.get( '/auth/github',	passport.authenticate( 'github', {
	scope: 'gist'
}));
router.get( '/auth/github/callback', github_auth_middleware );
router.get( '/', function( req, res ){

	res.expose( req.user || {}, 'terse.user_data' );
	res.render( 'index.hbs', {
		user: req.user
	});

});
router.get( '/g/:id', function( req, res ){

	res.expose( req.user || {}, 'terse.user_data' );
	res.expose( req.params || {}, 'terse.request.params' );
	res.render( 'index.hbs', {
		user: req.user
	});

});

router.listen( 8080 );