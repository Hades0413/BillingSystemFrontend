const path = require("path");

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-firefox-launcher"),
      require("karma-jasmine-html-reporter"),
      require("@angular-devkit/build-angular/plugins/karma"),
      require("karma-coverage"),
    ],

    client: {
      jasmine: {
        random: true,
        stopSpecOnExpectationFailure: false,
      },
      clearContext: false,
    },

    coverageReporter: {
      dir: path.join(__dirname, "./coverage"),
      subdir: ".",
      reporters: [
        { type: "html" },
        { type: "text-summary" },
        { type: "lcov" },
        { type: "json" },
      ],
      watermarks: {
        statements: [50, 80],
        branches: [50, 80],
        functions: [50, 80],
        lines: [50, 80],
      },
    },

    reporters: ["progress", "kjhtml", "coverage"],

    browsers: ["Chrome", "Firefox"],
    customLaunchers: {},

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    singleRun: false,

    restartOnFileChange: true,

    browserNoActivityTimeout: 100000,

    captureTimeout: 120000,

    browserslist: "defaults",
  });
};
