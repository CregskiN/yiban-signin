import Koa from 'koa';
import parser from 'koa-bodyparser';
import config from './config';
import catchError from './src/middlewares/catchError';
import { InitManageManager } from './src/core/init';

const app = new Koa();


app.use(catchError());
app.use(parser());
InitManageManager.initCore(app);

app.listen(config.server.port + 1, () => {
    console.log(`yiban signin running on prot ${config.server.port + 1}`)
})