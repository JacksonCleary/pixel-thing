const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: {
    app: './src/app.ts',
    sw: {
      import: './src/sdk/services/sw.ts',
      runtime: false, // Disable HMR for service worker
    },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clean dist folder on each build
    assetModuleFilename: 'assets/[name][ext]',
  },
  optimization: {
    runtimeChunk: 'single', // Add runtime chunk
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s?[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'src')],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
      {
        test: /\.html$/,
        exclude: /index\.html$/,
        type: 'asset/source',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      assets: path.resolve(__dirname, 'src/assets/'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/images',
          to: 'assets/images',
          noErrorOnMissing: true,
          info: {
            minimized: true,
          },
        },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
      publicPath: '/',
      watch: true,
    },
    historyApiFallback: true, // Redirect all 404s to index.html
    hot: true,
    port: 8080,
    headers: {
      'Service-Worker-Allowed': '/',
    },
    // devMiddleware: {
    //   writeToDisk: true, // Write files to disk for debugging
    // },
  },
};
