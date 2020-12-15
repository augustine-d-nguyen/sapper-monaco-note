import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const fire = NODE_ENV === 'firebase';

const beastmaster = express() // You can also use Express
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
  );
if (!fire) {
	beastmaster.listen(PORT, () => {
		console.log(`The server is up at port ${PORT}`);
	});
}

export { beastmaster };
