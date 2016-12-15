module.exports = function(config) {
  config.set({
    browsers: ['Firefox'],
    frameworks: ['mocha', 'browserify'],
    
    files: [
      'spec/*.spec.js'
    ],

    preprocessors: {
      'spec/*.spec.js': ['browserify']
    },
    plugins: [
      'karma-browserify',
      'karma-mocha',
      'karma-firefox-launcher'
    ]
  });
};