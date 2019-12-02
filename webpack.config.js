const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

function getSafeEnvVariables(env) {
	let safeEnv = {};

	Object.keys(env).forEach(key => {
		if (key.indexOf('REACT_APP') === 0) {
			safeEnv[key] = env[key];
		}
	});

	const envKeys = Object.keys(safeEnv).reduce((prev, next) => {
		prev[`process.env.${next}`] = JSON.stringify(env[next]);

		return prev;
	}, {});

	return envKeys;
}

const sharedConfig = {
	resolve: {
		alias: {
			server: path.resolve(__dirname, 'src/server/'),
			web: path.resolve(__dirname, 'src/web/'),
		},
	},
	mode: process.env.NODE_ENV,
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{
				test: /\.(woff(2)?|ttf|eot|png|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {},
					},
				],
			},
		],
	},
};

const serverConfig = {
	entry: './src/server/index.js',
	output: {
		path: path.resolve(__dirname, 'dist/server/'),
		filename: 'index.js',
	},
	devtool: 'sourcemap',
	target: 'node',
	externals: nodeExternals(),
	plugins: [
		new webpack.BannerPlugin({
			banner: `require("source-map-support").install();`,
			raw: true,
			entryOnly: false,
		}),
	],
	...sharedConfig,
};

const webConfig = {
	entry: { index: './src/web/index.js' },
	output: {
		path: path.resolve(__dirname, 'dist/web'),
		filename: '[name].[hash].js',
	},
	devtool: 'sourcemap',
	target: 'web',
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/web/index.html',
		}),
		new webpack.DefinePlugin(getSafeEnvVariables(process.env)),
		new CopyPlugin([{ from: 'src/assets', to: './' }]),
	],
	devServer: {
		contentBase: path.join(__dirname, 'dist/web'),
		compress: true,
		port: process.env.PORT || 3000,
	},
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						// get the name. E.g. node_modules/packageName/not/this/part.js
						// or node_modules/packageName
						const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

						// npm package names are URL-safe, but some servers don't like @ symbols
						return `npm.${packageName.replace('@', '')}`;
					},
				},
			},
		},
	},
	...sharedConfig,
};

module.exports = [serverConfig, webConfig];
