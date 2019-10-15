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
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          modules: true
        }
      },
      {
        loader: 'sass-loader',
        options: {
          importer: globImporter()
        }
      }
    ],
    include: [path.resolve(__dirname, './styles')]
  });

  config.module.rules.push({
    
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
      
  });

  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      presets: [['react-app', { flow: false, typescript: true }]],
    },
  })

  config.module.rules.push({
    test: /\.(js|jsx)$/,    loader: 'babel-loader',
    exclude: /node_modules/,
    include: [
        path.resolve(__dirname, '../../src/react-components'),
        path.resolve(__dirname, '../stories') ],
    query: {
      presets: [
        '@babel/preset-react',
        '@babel/preset-env'
      ],
      plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-transform-arrow-functions',
        '@babel/plugin-proposal-class-properties',
        // '@babel/plugin-symlink-import'
      ],
      babelrc: false,
    }
    
  });

  config.resolve.extensions.push('.ts', '.tsx');

  // Return the altered config
  return config;
};