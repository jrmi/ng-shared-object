'use strict';

module.exports = function (grunt) {
   // load all npm grunt tasks
   require('load-grunt-tasks')(grunt);

   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      karma: {
         unit: {
            configFile: 'karma.conf.js'
         }
      },

      uglify: {
         options: {
            banner: '/*! <%= pkg.name %> <%= pkg.version %> | Copyright (c) <%= grunt.template.today("yyyy") %> Jeremie Pardou | MIT License */'
         },

         build: {
            src: 'release/<%= pkg.name %>.js',
            dest: 'release/<%= pkg.name %>.min.js'
         }
      },

      coffee: {
         options: {
            sourceMap: false,
            sourceRoot: ''
         },
         dist: {
            files: [{
               expand: true,
               cwd: 'src/',
               src: '{,*/}*.coffee',
               dest: 'release',
               ext: '.js'
            }]
         },
         test: {
            files: [{
               expand: true,
               cwd: 'src/',
               src: '{,*/}*.coffee',
               dest: 'release',
               ext: '.js'
            }]
         }
      }
   });


   grunt.registerTask('test', ['coffee', 'karma']);

   grunt.registerTask('build', ['coffee', 'uglify']);

   grunt.registerTask('default', [
      'build',
      'test'
   ]);
};