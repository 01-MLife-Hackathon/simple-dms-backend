import "reflect-metadata";
import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import logger from 'koa-logger';
import koaBody from 'koa-body';
import helmet from 'koa-helmet';
import http from 'http';

import {createConnection} from "typeorm";
const connetion = createConnection();

connetion.then(async connection => {
  console.log("database check complite");
}).catch(error => console.log(error));

import api from './api';

const app = new Koa();
const router = new Router();

app.use(helmet());
app.use(cors());
app.use(logger());//http 메소드 로거 사용
app.use(koaBody());
app.use(router.routes()).use(router.allowedMethods());

router.use('/api', api.routes());


let serverCallback = app.callback();
let httpServer = http.createServer(serverCallback);

httpServer.listen(4000, ()=>{console.log("success 4000")});