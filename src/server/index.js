import '@babel/polyfill';

import path from 'path';
import express from 'express';
import logger from 'morgan';

const PORT = process.env.SERVER_PORT || process.env.PORT || 4000;

async function StartServer() {
	const app = express();

	app.use(logger('dev'));
	app.use('/', express.static('dist/web'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve('dist/web', 'index.html'));
	});

	return await new Promise(resolve => app.listen(PORT, () => resolve(app)));
}

StartServer().then(app => {
	console.log(`Server started at http://localhost:${PORT}`);
});
