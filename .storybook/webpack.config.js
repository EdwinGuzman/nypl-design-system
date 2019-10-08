const path = require('path');
const globImporter = require('node-sass-glob-importer');

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  config.module.rules.push({
    test: /\.scss$/,
    use: [
      'style-loader',
      'css-loader',
      'sass-loader',
      'import-glob-loader'
    ],
    include: path.resolve(__dirname, '../'),
  });

  // Return the altered config
  return config;
};