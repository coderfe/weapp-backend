import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from './routes/index.js';
import { logger, responseTime, verifyToken } from './middleware/index.js';
import { conn } from './database/index.js';

const app = new Koa();

app.use(logger);
app.use(responseTime);
app.use(verifyToken);
app.use(bodyParser());

app.use(router.routes());

app.listen(3000, async () => {
  await conn.sync();
  console.log('App running at http://localhost:3000');
});
