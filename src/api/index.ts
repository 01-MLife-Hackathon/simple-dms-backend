import Router from '@koa/router';

const api = new Router();

import {login, extension, homecoming, reissuance} from './api.controller';

api.post('/auth', login);
api.post('/extension', extension);
api.post('/homecoming', homecoming);
api.get('/reissuance', reissuance);


export default api;