module.exports = function (config) {
   config.set({

      basePath: './',

      files: [
         'bower_components/angular/angular.js',
         'bower_components/angular-mocks/angular-mocks.js',
         'bower_components/autobahn/autobahn.js',
         'bower_components/angular-wamp/release/angular-wamp.js',
         'release/ng-shared-object.js',
         'test/spec.js'
      ],

      autoWatch: true,

      frameworks: ['jasmine'],

      browsers: ['Firefox'],

      plugins: [
         'karma-chrome-launcher',
         'karma-firefox-launcher',
         'karma-jasmine',
         'karma-junit-reporter'
      ],

      junitReporter: {
         outputFile: 'test_out/unit.xml',
         suite: 'unit'
      }

   });
};
