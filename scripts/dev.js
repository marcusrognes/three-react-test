const webpack = require('webpack');
const [serverConfig, webConfig] = require('../webpack.config');
const nodemon = require('nodemon');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');

const PORT = process.env.PORT || 3000;
const SERVER_PORT = process.env.SERVER_PORT || PORT + 10;

process.env.REACT_APP_API_BASE_URL = `http://localhost:${SERVER_PORT}`;

function StartDev() {
	const serverCompiler = webpack(serverConfig);
	serverCompiler.watch(
		{
			aggregateTimeout: 300,
		},
		(err, stats) => {
			console.log(`SERVER:\n${stats}\n\n`);
		}
	);

	const webCompiler = webpack({ ...webConfig, devtool: 'eval' });

	const webDevServer = new WebpackDevServer(webCompiler, {
		proxy: {
			'/graphql': process.env.REACT_APP_API_BASE_URL,
		},
		noInfo: true,
		hot: true,
		inline: true,
		historyApiFallback: true,
		contentBase: path.join(__dirname, 'dist/web'),
	});

	webDevServer.listen(PORT, 'localhost', () => {
		console.log(`Starting admin server on http://localhost:${PORT}`);
	});
}

nodemon({
	script: 'dist/server/index.js',
	ext: 'js json',
});

StartDev();
