/**
 * Created by Leiness on 4/24/16.
 */


"use strict";

module.exports = function (grunt) {
    // Load grunt tasks automatically
    require('time-grunt')(grunt);

    var compass = require('compass-importer'),
        userPreferences = require('./userPreferences/userPreferences');


    // Project configuration.
    grunt.initConfig({
        // define
        pkg: grunt.file.readJSON('package.json'),

        rootPath: '../',
        configPath: '<%= rootPath %>' + 'config/',
        markupPath: '<%= rootPath %>' + 'markup/',
        assetsPath: '<%= rootPath %>' + 'assets/',
        stylesPath: '<%= assetsPath %>' + 'styles/',
        sassPath: '<%= stylesPath %>' + '_sass/',
        scriptsPath: '<%= assetsPath %>' + 'scripts/',
        imagesPath: '<%= assetsPath %>' + 'images/',

        availabletasks: {
            tasks: {}
        },

        sass: {
            options: {
                sourceMap: false,
                importer: compass
            },
            deploy: {
                options: {
                    outputStyle: 'compressed'
                },
                expand: true,
                cwd: '<%= sassPath %>',
                src: '*.scss',
                dest: '<%= stylesPath %>' + 'deploy',
                ext: '.css'
            },
            development: {
                options: {
                    sourceComments: true,
                    outputStyle: 'expanded'
                },
                expand: true,
                cwd: '<%= sassPath %>',
                src: '*.scss',
                dest: '<%= stylesPath %>' + '_development',
                ext: '.css'
            }
        },


        watch: {
            options: {
                livereload: userPreferences.isLivereloadEnabled(),
                noLineComments: true,
                debugInfo: true
            },
            css: {
                files: '<%= sassPath %>' + '**/*.scss',
                tasks: ['sass:development'],
                options: {
                    livereload: userPreferences.isLivereloadEnabled("css")
                }
            },
            js: {
                files: ['<%= scriptsPath %>**/*.js', '!<%= scriptsPath %>deploy/*.*'],
                tasks: [
                    'clean:temp',
                    'injector:configExt',
                    'injector:configShared',
                    'injector:configUnsupported',
                    'injector:configDefault'
                ],
                options: {
                    livereload: userPreferences.isLivereloadEnabled("js")
                }
            },
            xslt: {
                files: '<%= assetsPath %>' + 'templates/**/*.xslt',
                options: {
                    livereload: userPreferences.isLivereloadEnabled("xslt")
                }
            },
            config: {
                files: '<%= configPath %>' + '**/*.*',
                options: {
                    livereload: userPreferences.isLivereloadEnabled("config")
                }
            },
            markup: {
                files: '<%= markupPath %>' + '**/*.*',
                options: {
                    livereload: userPreferences.isLivereloadEnabled("config")
                }
            },
            svgIcons: {
                files: '<%= imagesPath %>_svg-icons/raw/*.*',
                tasks: ['_grunticonDevelopment']
            },
            prototype: {
                files: '<%= rootPath %>_prototype/**/*.*',
                options: {
                    livereload: userPreferences.isLivereloadEnabled("prototype")
                }
            }

        },


        copy: {
            grunticon: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '../.temp/grunticon/',
                    dest: '<%= stylesPath %>_development/',
                    src: [
                        '*.css'
                    ]
                }]
            },
            grunticonPreview: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '../.temp/grunticon/',
                    dest: '<%= stylesPath %>_gui/',
                    src: [
                        '*.css'
                    ]
                }]
            },
            grunticonDeploy: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '../.temp/grunticon/',
                    dest: '<%= stylesPath %>deploy/',
                    src: [
                        '*.css'
                    ]
                }]
            },
            grunticonSVG: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= imagesPath %>_svg-icons/compressed/',
                    dest: '<%= imagesPath %>icons/svg-icons-svg/',
                    src: [
                        '*.svg'
                    ]
                }]
            }
        },

        injector: {
            options: {},
            configExt: {
                options: {
                    transform: function (filePath) {
                        filePath = filePath.replace(/.*\/assets\/[^\/]*\//, '');
                        //return '<script src="' + filePath + '"></script>';
                        return '<import src="' + filePath + '" group="head"/>';
                    },

                    sort: function (a, b) {
                        if (a < b) return 1;
                        if (a > b) return -1;
                        return 0;
                    },
                    starttag: '<!-- injector-ext:js -->',
                    endtag: '<!-- endinjector-ext -->'
                },
                files: {
                    './../config/scripts.config': ['<%= scriptsPath %>backboneExtensions/**/*.js']
                }
            },
            configShared: {
                options: {
                    transform: function (filePath) {
                        filePath = filePath.replace(/.*\/assets\/[^\/]*\//, '');
                        //return '<script src="' + filePath + '"></script>';
                        return '<import src="' + filePath + '" group="default"/>\r\n    <import src="' + filePath + '" group="unsupportedbrowser"/>';
                    },

                    sort: function (a, b) {
                        if (a < b) return -1;
                        if (a > b) return 1;
                        return 0;
                    },
                    starttag: '<!-- injector-shared:js -->',
                    endtag: '<!-- endinjector-shared -->'
                },
                files: {
                    './../config/scripts.config': ['<%= scriptsPath %>' + 'appShared/**/*.js']
                }
            },
            configDefault: {
                options: {
                    transform: function (filePath) {
                        filePath = filePath.replace(/.*\/assets\/[^\/]*\//, '');
                        //return '<script src="' + filePath + '"></script>';
                        return '<import src="' + filePath + '" group="default"/>';
                    },

                    sort: function (a, b) {
                        if (a < b) return -1;
                        if (a > b) return 1;
                        return 0;
                    },
                    starttag: '<!-- injector-default:js -->',
                    endtag: '<!-- endinjector-default -->'
                },
                files: {
                    './../config/scripts.config': ['<%= scriptsPath %>' + 'app/**/*.js']
                }
            },
            configUnsupported: {
                options: {
                    transform: function (filePath) {
                        filePath = filePath.replace(/.*\/assets\/[^\/]*\//, '');
                        //return '<script src="' + filePath + '"></script>';
                        return '<import src="' + filePath + '" group="unsupportedbrowser"/>';
                    },

                    sort: function (a, b) {
                        if (a < b) return -1;
                        if (a > b) return 1;
                        return 0;
                    },
                    starttag: '<!-- injector-unsupportedBrowser:js -->',
                    endtag: '<!-- endinjector-unsupportedBrowser -->'
                },
                files: {
                    './../config/scripts.config': ['<%= scriptsPath %>appUnsupportedBrowser/**/*.js']
                }
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
            scriptsWithoutLogs: {
                options: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true
                        //,
                        //global_defs: {
                        //    "LOG_DEBUG": false
                        //}
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: '../assets/scripts/deploy/',
                        src: '**/*.min.js',
                        dest: '../assets/scripts/deploy/'
                    }
                ]
            },
            scriptsWithLogs: {
                files: [
                    {
                        expand: true,
                        cwd: '../assets/scripts/deploy/',
                        src: '**/*.min.log.js',
                        dest: '../assets/scripts/deploy/'
                    }
                ]
            }
        },

        clean: {
            options: {
                force: true
            },
            stylesDeploy: ['<%= stylesPath %>deploy/*', '!<%= stylesPath %>deploy/icons.*.css'],
            stylesAfterDeploy: ['<%= stylesPath %>deploy/x_*.css'],
            scriptsDeploy: ['<%= scriptsPath %>deploy/*', '!<%= stylesPath %>deploy/icons.*.css'],
            svgIcons: ['<%= imagesPath %>_svg-icons/compressed/*', '<%= imagesPath %>icons/svg-icons-svg/*', '<%= imagesPath %>icons/svg-icons-png/*', '<%= stylesPath %>*/icons.*.css'],
            temp: ['../.tmp']
        },

        'string-replace': {
            grunticonIDs: {
                options: {
                    replacements: [
                        {
                            pattern: /id="(?!SVGID)([^"]*)" ?/ig,
                            replacement: ''
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= imagesPath %>_svg-icons/compressed/',
                        src: '*.svg',
                        dest: '<%= imagesPath %>_svg-icons/compressed/'
                    }
                ]
            },
            grunticonUIClassNames: {
                options: {
                    replacements: [
                        {
                            pattern: /id="([^"]*)"/ig,
                            replacement: 'class="configurator-$1"'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= imagesPath %>_svg-icons/compressed/',
                        src: 'configurator-step1-track.svg',
                        dest: '<%= imagesPath %>_svg-icons/compressed/'
                    }
                ]
            },
            grunticonPreloaderClassNames: {
                options: {
                    replacements: [
                        {
                            pattern: /id="([^"]*)"/ig,
                            replacement: 'class="preloader-$1"'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= imagesPath %>_svg-icons/compressed/',
                        src: 'preloader-*.svg',
                        dest: '<%= imagesPath %>_svg-icons/compressed/'
                    }
                ]
            }
        },

        svgmin: {
            options: {
                force: true,
                plugins: [
                    {cleanupAttrs: true},
                    {cleanupEnableBackground: true},
                    {cleanupIDs: false},
                    {cleanupNumericValues: true},
                    {collapseGroups: true},
                    {convertColors: true},
                    {convertPathData: true},
                    {convertShapeToPath: false},
                    {convertStyleToAttrs: true},
                    {convertTransform: true},
                    {mergePaths: true},
                    {moveElemsAttrsToGroup: true},
                    {moveGroupAttrsToElems: true},
                    {removeComments: true},
                    {removeDoctype: true},
                    {removeEditorsNSData: true},
                    {removeEmptyAttrs: true},
                    {removeEmptyContainers: true},
                    {removeEmptyText: true},
                    {removeHiddenElems: true},
                    {removeMetadata: true},
                    {removeNonInheritableGroupAttrs: true},
                    {removeRasterImages: false}, //Keep raster images with the svg
                    {removeTitle: true},
                    {removeUnknownsAndDefaults: true},
                    {removeUnusedNS: true},
                    {removeUselessStrokeAndFill: false}, //Enabling this may case small details to be removed
                    {removeViewBox: false}, //I keep the view box because that's where illustrator hides the SVG dimensions
                    {removeXMLProcInst: false}, //Enabling this breaks grunticon because it removes the XML header
                    {sortAttrs: true},
                    {transformsWithOnePath: false} //Enabling this breaks Illustrator SVGs with complex text?
                ]
            },
            default: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= imagesPath %>_svg-icons/raw/',
                        src: ['*.svg'],
                        dest: '<%= imagesPath %>_svg-icons/compressed/'
                    }
                ]
            }
        },

        grunticon: {
            options: {
                pngcrush: false,
                datasvgcss: 'icons.data.svg.css',
                datapngcss: 'icons.data.png.css',
                urlpngcss: 'icons.fallback.css',

                pngfolder: '../<%= imagesPath %>icons/svg-icons-png',
                pngpath: '/assets/images/icons/svg-icons-png',

                previewhtml: '../<%= stylesPath %>_gui/icon-preview.html',
                previewTemplate: 'grunticonPreview.hbs',
                loadersnippet: 'grunticon.loader.txt',

                template: 'grunticonCSS.hbs',
                cssprefix: '.icon-',
                defaultWidth: '300px',
                defaultHeight: '200px',

                cssbasepath: '/'
            },
            default: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= imagesPath %>_svg-icons/compressed',
                        src: ['*.svg', '*.png'],
                        dest: '../.temp/grunticon/'
                    }
                ]
            }
        },

        concurrent: {
            options: {
                limit: 5
            },
            deploy1: ['_scriptsDeploy', '_stylesDeploy', '_grunticonDeploy'],
            deploy2: ['_increaseBuildVersion', '_silhouette']
        }
    });

    grunt.loadNpmTasks('grunt-available-tasks');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-asset-injector');
    grunt.loadNpmTasks('grunt-grunticon');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-concurrent');


    /* +++ FUNCTIONS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    var privateFunctions = {
        _scriptsParseAndConcat: function () {
            require('./tasks/parseAndConcatJavaScript.js').process();
        },
        _parseAndConcat718MailTemplates: function () {
            require('./tasks/parseAndConcat718MailTemplates.js').process();
        },
        _parseAndConcat718FailedTrackImages: function () {
            require('./tasks/parseAndConcat718FailedTrackImages.js').process();
        },
        _increaseBuildVersion: function () {
            require('./tasks/increaseBuildVersion.js').process();
        },
        _silhouette: function () {
            require('./tasks/silhoutte.js').process(grunt);
        }
    };

    /* +++ PRIVATE ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    //
    grunt.registerTask('_generateMailTemplateSQL', 'Parse the mail templates and generate sql', privateFunctions._parseAndConcat718MailTemplates);
    grunt.registerTask('_generateFailedServiceImagesUpdateSQL', 'Parse the data (_02_in_progress) and generate sql', privateFunctions._parseAndConcat718FailedTrackImages);


    // Build Version
    grunt.registerTask('_increaseBuildVersion', 'Increase build-version number', privateFunctions._increaseBuildVersion);
    grunt.registerTask('_silhouette', 'Show the silhouette', privateFunctions._silhouette);

    // JavaScript
    grunt.registerTask('_scriptsParseAndConcat', 'parse and concat javascripts', privateFunctions._scriptsParseAndConcat);
    grunt.registerTask('_scriptsDeploy', ['clean:scriptsDeploy', 'injector', '_scriptsParseAndConcat', 'uglify:scriptsWithoutLogs', 'uglify:scriptsWithLogs']);

    // Styles
    grunt.registerTask('_stylesDeploy', ['clean:stylesDeploy', 'sass:deploy', 'clean:stylesAfterDeploy']);

    // Gruntion
    grunt.registerTask('_grunticonReplace', ['string-replace:grunticonUIClassNames', 'string-replace:grunticonPreloaderClassNames', 'string-replace:grunticonIDs']);
    grunt.registerTask('_grunticonDeploy', ['clean:svgIcons', 'svgmin', '_grunticonReplace', 'grunticon', 'copy:grunticon', 'copy:grunticonDeploy', 'copy:grunticonPreview', 'copy:grunticonSVG']);
    grunt.registerTask('_grunticonDevelopment', ['clean:svgIcons', 'svgmin', '_grunticonReplace', 'grunticon', 'copy:grunticon', 'copy:grunticonPreview', 'copy:grunticonSVG']);

    /* +++ GLOBAL +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    // List Tasks
    grunt.registerTask('taskList', ['availabletasks']);

    // Sequential deploy task
    //grunt.registerTask('deploy', ['_scriptsDeploy', '_stylesDeploy', '_grunticonDeploy', '_increaseBuildVersion', '_silhouette']);

    // Concurrent deploy task
    grunt.registerTask('deploy', ['concurrent:deploy1', 'concurrent:deploy2']);

    // Start watch and develop
    grunt.registerTask('default', ['clean:temp', 'injector', 'watch']);
};


