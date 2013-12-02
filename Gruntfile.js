module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');

	grunt.initConfig({
		pkg: pkg,
		stylus: {
			compile: {
				files: {
					'assets/compiled/styles.css': [
						'assets/styles/vendor/reset.css',
						'assets/styles/terse.styl'
					]
				}
			}
		},
		handlebars: {
			templates: {
				options: {
					namespace: false,
					commonjs: true,
					processName: function( file_path ){
						return file_path.replace( /^(assets\/templates\/)/, '' ).replace( /(\.hbs)$/, '' );
					}
				},
				files: {
					'assets/compiled/templates.js': ['assets/templates/**/*.hbs']
				}
			}
		},
		browserify: {
			options: {
				shim: {
					jquery: {
						path: 'assets/scripts/vendor/jquery.js',
						exports: '$'
					},
					codemirror: {
						path: 'assets/scripts/vendor/codemirror/codemirror.js',
						exports: 'CodeMirror'
					},
					'codemirror-mode-javascript': {
						path: 'assets/scripts/vendor/codemirror/mode/javascript/javascript.js',
						exports: null,
						depends: {
							codemirror: 'CodeMirror'
						}
					},
					'codemirror-mode-css': {
						path: 'assets/scripts/vendor/codemirror/mode/css/css.js',
						exports: null,
						depends: {
							codemirror: 'CodeMirror'
						}
					},
					'codemirror-mode-xml': {
						path: 'assets/scripts/vendor/codemirror/mode/xml/xml.js',
						exports: null,
						depends: {
							codemirror: 'CodeMirror'
						}
					},
					'codemirror-mode-htmlmixed': {
						path: 'assets/scripts/vendor/codemirror/mode/htmlmixed/htmlmixed.js',
						exports: null,
						depends: {
							codemirror: 'CodeMirror'
						}
					}
				}
			},
			terse: {
				files: {
					'assets/compiled/scripts.js': ['assets/scripts/terse.js']
				}
			}
		},
		less: {
			compile: {
				options: {
					paths: ['assets/styles/'],
					strictImports: true,
					syncImport: true
				},
				files: {
					'assets/compiled/styles.css': ['assets/styles/terse.less']
				}
			}
		},
		cssjoin: {
			compile: {
				options: {
					paths: ['assets/styles']
				},
				files: {
					'assets/compiled/styles.css': ['assets/compiled/styles.css']
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
			css: {
				files: [ 'assets/styles/**/*.less', 'assets/styles/**/*.css' ],
				tasks: [ 'buildcss' ]
			},
			js: {
				files: [ 'assets/templates/**/*.hbs', 'assets/scripts/**/*.js' ],
				tasks: [ 'buildjs' ]
			},
			livereload: {
				options: {
					livereload: true
				},
				files: [ 'assets/compiled/styles.css' ]
			}
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
	grunt.registerTask( 'buildcss', [ 'less', 'cssjoin' ] );
	grunt.registerTask( 'buildjs', [ 'handlebars', 'browserify' ] );
	grunt.registerTask( 'build', [ 'buildcss', 'buildjs' ] );
	grunt.registerTask( 'minify', [ 'uglify', 'cssmin' ] );
	grunt.registerTask( 'predeploy', [ 'build' ] );
	grunt.registerTask( 'dev', [ 'build', 'server', 'watch' ] );

};