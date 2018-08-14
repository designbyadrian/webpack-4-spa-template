const isDev = require('isdev');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier');

const port = 8080;

const compilationSuccessInfo = isDev
  ? {
    messages: [`You application is running on http://localhost:${port}`],
    notes: ['Press ctrl-c to stop the server'],
  } : {};

module.exports = {
  devServer: {
    compress: false,
    hot: true,
    port,
    quiet: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              /* eslint global-require: 0 */
              plugins: () => [require('autoprefixer')],
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          'image-webpack-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      title: 'Spendy Pig',
      filename: './index.html',
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: isDev ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDev ? '[id].css' : '[id].[hash].css',
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo,
      clearConsole: true,
      onErrors: (severity, errors) => {
        if (severity !== 'error') {
          return;
        }

        const error = errors[0];
        notifier.notify({
          title: 'Webpack error',
          message: `${severity}: ${error.name}`,
          subtitle: error.file || '',
          // icon: path.join(process.cwd(), 'assets/logo_box.png'),
        });
      },
    }),
  ],
};
