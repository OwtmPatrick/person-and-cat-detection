const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle-[hash].js'
	},
	resolve: {
		extensions: ['.js']
	},
	devServer: {
		contentBase: 'dist',
		compress: true,
		port: 3000
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: process.env.NODE_ENV === 'development'
						}
					},
					'css-loader',
					'postcss-loader',
					'less-loader'
				]
			},
			{
				test: /\.(svg|jpg|jpeg|png|woff|woff2|ttf|eot|otf)([?]?.*)$/,
				loader: 'file-loader?name=assets/fonts/[name].[ext]'
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'src/index.html',
					to: './index.html'
				},
				{
					from: 'src/assets/**/*',
					to: './assets',
					transformPath: targetPath => targetPath.replace('src/assets', '')
				}
			]
		}),
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			minify: {
				collapseWhitespace: true,
				removeComments: true,
				removeRedundantAttributes: true,
				useShortDoctype: true
			}
		}),
		new MiniCssExtractPlugin({
			filename: 'style-[hash].css',
			allChunks: true
		})
	]
};
