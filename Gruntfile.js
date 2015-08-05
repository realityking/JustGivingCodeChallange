'use strict';

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        autoprefixer: {
            options: {
                browsers: ['last 2 version', 'Firefox ESR', 'ie 9']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'assets/css/',
                        src: '{,*/}*.css',
                        dest: 'assets/css/'
                    }
                ]
            }
        },

        babel: {
            dist: {
                files: {
                    'assets/javascript/main.js': 'src/javascript/main.js'
                }
            }
        },

        sass: {
            options: {
                sourceComments: true
            },
            dist: {
                files: {
                    'assets/css/styles.css': 'src/css/styles.scss'
                }
            }
        }
    });

    grunt.registerTask('css', [
        'sass',
        'autoprefixer'
    ]);

    grunt.registerTask('js', [
        'babel'
    ]);

    grunt.registerTask('build', [
        'css',
        'js'
    ]);
};
