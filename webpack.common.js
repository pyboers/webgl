"use strict";

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: '/app/main.ts',
	output: {
		filename: '[name].js',
		chunkFilename: 'vendor.js',
		path: path.resolve(__dirname, 'docs')
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './app/index.html'
		})
	],
	optimization: {
		splitChunks: {
			chunks: 'all'
		}
	}
};