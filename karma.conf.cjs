module.exports = function configureKarma(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-webpack'),
      require('karma-coverage'),
      require('karma-chrome-launcher'),
    ],
    files: [
      { pattern: 'src/**/*.spec.jsx', watched: false },
      { pattern: 'src/**/*.spec.js', watched: false },
    ],
    preprocessors: {
      'src/**/*.spec.jsx': ['webpack'],
      'src/**/*.spec.js': ['webpack'],
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: {
        rules: [{
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
              plugins: ['istanbul'],
            },
          },
        }],
      },
      resolve: { extensions: ['.js', '.jsx', '.json'] },
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [{ type: 'text-summary' }, { type: 'html', subdir: 'html' }],
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
    restartOnFileChange: false,
  });
};
