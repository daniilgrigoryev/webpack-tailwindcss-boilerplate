const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const { argv } = require('process')

module.exports = (env, argv) => {
  const dev = argv.mode === 'development' ? true : false
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      publicPath: '',
      filename: dev ? '[name].js' : '[name].[hash].bundle.js',
      assetModuleFilename: 'images/[hash][ext][query]',
    },
    module: {
      rules: [
        {
          test: /\.html$/i,
          use: 'html-loader',
        },
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [dev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
          exclude: /node_modules/,
        },
        {
          test: /\.(?:ico|gif|svg|png|jpg|jpeg)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/,
          type: 'asset/inline',
        },
      ],
    },
    devtool: dev ? 'inline-source-map' : false,
    devServer: {
      open: true,
      bonjour: true,
      compress: true,
      hot: true,
      historyApiFallback: true,
      contentBase: path.join(__dirname, 'build'),
      overlay: {
        warnings: true,
        errors: true,
      },
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
      },
      extensions: ['*', '.js', '.css'],
    },
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
    },
    optimization: {
      minimize: true,
      moduleIds: 'deterministic',
      runtimeChunk: true,
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    plugins: [
      new ImageMinimizerPlugin({
        minimizerOptions: {
          plugins: [
            ['gifsicle', { interlaced: true }],
            ['jpegtran', { progressive: true }],
            ['optipng', { optimizationLevel: 5 }],
            ['svgo', { plugins: [{ removeViewBox: false }] }],
          ],
        },
      }),
      new MiniCssExtractPlugin({
        filename: '[name].bundle.css',
        chunkFilename: '[id].css',
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
      }),
    ],
  }
}
