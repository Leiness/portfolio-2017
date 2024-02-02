/**
 * Created by Leiness on 4/17/16.
 */
module.exports = function (grunt) {

    var compass = require('compass-importer');

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        cssPath: '../css/',
        sassPath: '../_sass/',
        scriptPath: '../_scripts/',
        scriptPathDeploy: '../scripts/',

        sass: {
            options: {
                sourceMap: false,
                importer: compass
            },
            development: {
                expand: true,
                cwd: '<%= sassPath %>',
                src: '*.scss',
                dest: '<%= cssPath %>',
                ext: '.css'
            },
            deploy: {
                options: {
                    style: 'compressed'
                },
                expand: true,
                cwd: '<%= sassPath %>',
                src: '*.scss',
                dest: '<%= cssPath %>',
                ext: '.css'
            }
        },
        watch: {
            options: {
                livereload: true
            },
            css: {
                files: '<%= sassPath %>' + '**/*.scss',
                tasks: ['sass:development']
            }
        },
        concat: {
            basic: {
                src: [
                    '<%= scriptPath %>' + 'jquery-1.12.3.min.js',
                    '<%= scriptPath %>' + 'classie.js',
                    '<%= scriptPath %>' + 'sidebarEffects.js',
                    '<%= scriptPath %>' + 'navi.js'
                ],
                dest: '<%= scriptPath %>' + 'leiness.js'
            }
        },
        uglify: {
            options: {
                mangle: true,
                sourceMap: 'true',
                compress: true,
                preserveComments: 'some',
                banner: '/*! <%= grunt.template.today("yyyy-mm-dd hh:mm") %> */'
            },
            scripts: {
                options: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= scriptPath %>',
                        src: 'leiness.js',
                        dest: '<%= scriptPathDeploy %>'
                    }
                ]
            }

        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

//    grunt.loadNpmTasks('grunt-available-tasks');
//    grunt.loadNpmTasks('grunt-contrib-copy');
//    grunt.loadNpmTasks('grunt-contrib-clean');
//    grunt.loadNpmTasks('grunt-asset-injector');
//    grunt.loadNpmTasks('grunt-grunticon');
//    grunt.loadNpmTasks('grunt-svgmin');
//    grunt.loadNpmTasks('grunt-string-replace');
//    grunt.loadNpmTasks('grunt-concurrent');

    // css build
    grunt.registerTask('sass-build', ['sass:deploy']);

    // scss wath
    grunt.registerTask('sass-watch', ['watch']);

    // js build
//    grunt.registerTask('js-uglify', ['concat:basic']);
    grunt.registerTask('js-uglify', ['concat:basic', 'uglify:scripts']);

    // css watch
    grunt.registerTask('default', ['watch']);
};