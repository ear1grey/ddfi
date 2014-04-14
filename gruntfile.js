/*global module */
module.exports = function (grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jslint: {
            all: {
               src: ['<%= pkg.folders.src %>/**/*.js'],
               directives: {
                   browser: true,
                   predef: [
                       'rdfx',
                       'md5',
                       'FileReader' // remove when jshint catches up
                   ]
               }
            }
        },

		sass: {
			dist: {
				options: {
					style: 'expanded',
					lineNumbers: true,
				},
				files: [{
					expand: true,
					cwd: '<%= pkg.folders.src %>/',
					src: ['*.scss'],
					dest: '<%= pkg.folders.build %>',
					ext: '.css',
				}]
			}
		},

        copy: {
            main: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        src: ['<%= pkg.folders.src %>/**/*.html'],
                        dest: '<%= pkg.folders.build %>/',
                        filter: 'isFile',
                        flatten: true
                    },

                    {
                        expand: true,
                        src: ['**/md5.min.js', '**/cc-by-sa-88x31.png'],
                        dest: '<%= pkg.folders.build %>/',
                        filter: 'isFile',
                        flatten: true
                    },

                ]
            }
        },

        qunit: {
            all: ['<%= pkg.folders.test %>/**/*.html']
        },

        uglify: {
            my_target: {
                files: {
                    '<%= pkg.folders.build %>/<%= pkg.name %>.min.js': ['<%= pkg.folders.src %>/**/*.js']
      			}
    		}
  		},

        watch: {
            files: ['<%= pkg.folders.src %>/**/*'],
            tasks: ['default'],
            options: {
                livereload: true
            }
        }

    });

    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');


    grunt.registerTask('default', ['jslint', 'sass', 'uglify', 'copy']);

};