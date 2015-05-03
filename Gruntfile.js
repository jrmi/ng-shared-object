'use strict';

module.exports = function (grunt) {
   // load all npm grunt tasks
   require('load-grunt-tasks')(grunt);

   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      karma: {
         unit: {
            options: {
               files: [
                  'bower_components/angular/angular.js',
                  'bower_components/angular-mocks/angular-mocks.js',
                  'bower_components/chai/chai.js',
                  'ng-shared-object.js',
                  'test/spec.js'
               ]
            },

            frameworks: ['mocha'],

            browsers: [
               'Chrome',
               'PhantomJS',
               'Firefox'
            ],

            singleRun: true
         }
      },

      uglify: {
         options: {
            banner: '/*! <%= pkg.name %> <%= pkg.version %> | Copyright (c) <%= grunt.template.today("yyyy") %> Jeremie Pardou | MIT License */'
         },

         build: {
            src: '<%= pkg.name %>.js',
            dest: '<%= pkg.name %>.min.js'
         }
      },

      coffee: {
         options: {
            sourceMap: true,
            sourceRoot: ''
         },
         dist: {
            files: [{
               expand: true,
               cwd: 'src/',
               src: '{,*/}*.coffee',
               dest: '',
               ext: '.js'
            }]
         },
         test: {
            files: [{
               expand: true,
               cwd: 'test/spec',
               src: '{,*/}*.coffee',
               dest: '.tmp/spec',
               ext: '.js'
            }]
         }
      }
   });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

   grunt.registerTask('test', ['karma']);

   grunt.registerTask('default', [
      'test',
      'uglify'
   ]);
};