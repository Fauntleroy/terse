// Process environment variables
const VERSION = require('./package.json').version;
const GITHUB_APP_ID = process.env.TERSE_GITHUB_APP_ID;
const GITHUB_APP_SECRET = process.env.TERSE_GITHUB_APP_SECRET;
const URL = process.env.TERSE_URL || 'http://dev.terse';
const REDIS_HOST = process.env.TERSE_REDIS_HOST || 'local.host';
const REDIS_PORT = process.env.TERSE_REDIS_PORT || '6379';
const REDIS_PASS = process.env.TERSE_REDIS_PASS;
const HTTP_PORT = process.env.TERSE_HTTP_PORT || process.env.VCAP_APP_PORT || 8080;
const DEFAULT_GIST_ID = process.env.DEFAULT_GIST_ID || 5565184;
const USER_AGENT = 'Terse/'+ VERSION;

// Configure the web server
var express = require('express');
var expose = require('express-expose');
var express_handlebars = require('express3-handlebars');
var router = express();
var handlebars = express_handlebars({
	extname: '.hbs',
	defaultLayout: 'layout',
	layoutsDir: 'views'
});
var redis = require('redis');
var redis_client = redis.createClient( REDIS_PORT, REDIS_HOST );
if( REDIS_PASS ) redis_client.auth( REDIS_PASS );
var RedisStore = require('connect-redis')( express );

router.engine( 'hbs', handlebars );
router.set( 'view engine', 'hbs' );
router.use( express.static( __dirname + '/assets' ) );
router.use( express.cookieParser() );
router.use( express.bodyParser() );
router.use( express.session({
	secret: 'terseness is tersy',
	store: new RedisStore({
		client: redis_client
	})
}) );

router.configure( 'development', function(){
	router.use( express.logger() );
});

//Passport stuff
var passport = require('passport');

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
	callbackURL: URL +'/auth/github/callback',
	customHeaders: {
		'User-Agent': USER_AGENT
	}
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

	done( null, user );

}));

// Routes
router.get( '/', function( req, res ){

	res.redirect( '/g/'+ DEFAULT_GIST_ID );

});

router.get( '/new', function( req, res ){

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

router.get( '/auth/github',	passport.authenticate( 'github', {
	scope: ['user', 'gist']
}));

router.get( '/auth/github/callback', passport.authenticate( 'github', {
	successRedirect: '/',
	failureRedirect: '/?err=login-failed'
}));

router.get( '/logout', function( req, res ){

	req.logout();
	res.redirect('/');

});

router.listen( HTTP_PORT );
console.log( 'Terse listening on port '+ HTTP_PORT );