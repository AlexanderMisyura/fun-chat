import 'webpack-dev-server';

import path from 'node:path';

import Dotenv from 'dotenv';
import EslintPlugin from 'eslint-webpack-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import webpack from 'webpack';

const { dirname } = import.meta;

const dotenv = Dotenv.config({
  path: path.join(dirname, '.env'),
});

const config = (environment: { production?: boolean }): webpack.Configuration => {
  const isDevelopment = !environment.production;

  return {
    entry: path.resolve(dirname, './src/index.ts'),
    devtool: isDevelopment ? 'eval-source-map' : false,
    mode: isDevelopment ? 'development' : 'production',

    devServer: {
      historyApiFallback: true,
      client: { overlay: { warnings: false }, logging: 'none' },
    },

    optimization: {
      minimize: !isDevelopment,
    },

    resolve: {
      extensions: ['.ts', '.js'],
      plugins: [new TsconfigPathsPlugin()],
    },

    output: {
      publicPath: '/',
      filename: '[name].[contenthash].js',
      path: path.resolve(dirname, './dist'),
      assetModuleFilename: 'assets[name][est][query]',
      clean: true,
    },

    module: {
      rules: [
        {
          test: /\.(?:wav|mp3)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/audio/[hash][ext][query]',
          },
        },
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/img/[hash][ext][query]',
          },
        },
        {
          test: /\.woff2$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[hash][ext][query]',
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          exclude: /\.module\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { sourceMap: isDevelopment },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: isDevelopment },
            },
          ],
        },
        {
          test: /\.module\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDevelopment,
                modules: {
                  exportLocalsConvention: 'camel-case-only',
                  localIdentName: isDevelopment ? '[local]_[hash:base64:8]' : '[hash:base64:8]',
                },
              },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: isDevelopment },
            },
          ],
        },
        { test: /\.ts$/i, use: 'ts-loader' },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({ title: 'Fun Chat' }),
      new FaviconsWebpackPlugin(path.resolve(dirname, './public/chat.png')),
      new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
      new EslintPlugin({ configType: 'flat', extensions: 'ts' }),
      new StylelintPlugin(),
      new webpack.EnvironmentPlugin({
        API_URL: dotenv.parsed?.API_URL || 'ws://localhost:4000',
      }),
    ],
  };
};

export default config;
