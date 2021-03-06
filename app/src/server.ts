import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const beastmaster = express()
	.use(
		json({
			type: '*/*'
		})
	)
	.use(cookieParser())
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware({
			session: (req, res) => ({
				pid: false
			})
		})
	);
	if (dev) {
		beastmaster.listen(PORT, () => {
			console.log(`The server is up at port ${PORT}`);
		});
	}
	
	export { beastmaster };
	