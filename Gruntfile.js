module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');

	grunt.initConfig({
		pkg: pkg,
		stylus: {
			compile: {
				files: {
					'assets/compiled/styles.css': [
						'assets/styles/terse.styl'
					]
				}
			}
		},
		handlebars: {
			compile: {
				options: {
					namespace: 'terse.templates',
					processName: function( filename ){
						filename = filename.replace( /^assets\/templates\//i, '' );
						filename = filename.replace( /\.hbs$/i, '' );
						return filename;
					}
				},
				files: {
					'assets/compiled/templates.js': ['assets/templates/**/*.hbs']
				}
			}
		},
		concat: {
			js: {
				options: {
					separator: ';'
				},
				files: {
					'assets/compiled/terse.js': [
						'assets/scripts/vendor/jquery/**/*.js',
						'assets/scripts/vendor/bootstrap/**/*.js',
						'assets/scripts/vendor/underscore/**/*.js',
						'assets/scripts/vendor/backbone/**/*.js',
						'assets/scripts/vendor/codemirror/codemirror.js',
						'assets/scripts/vendor/codemirror/modes/**/*.js',
						'assets/scripts/vendor/jwerty/jwerty.js',
						'assets/scripts/vendor/handlebars/**/*.js',
						'assets/scripts/terse.js',
						'assets/compiled/templates.js',
						'assets/scripts/models/**/*.js',
						'assets/scripts/views/**/*.js',
						'assets/scripts/routers/**/*.js',
						'assets/scripts/application.js'
					]
				}
			},
			css: {
				options: {
					separator: '\n'
				},
				files: {
					'assets/compiled/styles.css': [
						'assets/styles/vendor/bootstrap/**/*',
						'assets/styles/vendor/font-awesome/**/*',
						'assets/styles/vendor/codemirror/**/*',
						'assets/compiled/styles.css'
					]
				}
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				files: {
					'assets/compiled/scripts.js': ['assets/compiled/scripts.js'],
					'assets/compiled/templates.js': ['assets/compiled/templates.js']
				}
			}
		},
		cssmin: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				files: {
					'assets/compiled/styles.css': ['assets/compiled/styles.css']
				}
			}
		},
		watch: {
			files: [
				'assets/scripts/**/*.js',
				'assets/styles/**/*.css',
				'assets/styles/**/*.styl',
				'assets/templates/**/*.hbs'
			],
			tasks: ['build']
		},
		jshint: {
			all: [ 'assets/scripts/**/*.js', '!assets/scripts/vendor/**/*.js' ]
		}
	});

	// the cool/easy way to do it
	Object.keys( pkg.devDependencies ).forEach( function( dep ){
		if( dep.substring( 0, 6 ) === 'grunt-' ) grunt.loadNpmTasks( dep );
	});

	grunt.registerTask( 'server', 'Start the Terse server', function(){
		var port = grunt.option('port') || grunt.option('p');
		var args = ['terse.js'];
		if( port ) args = args.concat([ '-p', port ]);
		grunt.util.spawn({
			cmd: 'node',
			args: args,
			opts: {
				stdio: 'inherit'
			}
		});
	});

	grunt.registerTask( 'default', ['build'] );
	grunt.registerTask( 'build', [ 'stylus', 'handlebars', 'concat' ] );
	grunt.registerTask( 'minify', [ 'uglify', 'cssmin' ] );
	grunt.registerTask( 'predeploy', [ 'build' ] );
	grunt.registerTask( 'dev', [ 'build', 'server', 'watch' ] );

};