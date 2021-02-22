import Router from '@koa/router';

const api = new Router();

import {login, extension, homecoming, homecomingInfo, reissuance, extensionInfo, extensionCancel, meal} from './api.controller';

api.post('/auth', login);
api.post('/extension', extension);
api.post('/homecoming', homecoming);
api.get('/homecominginfo', homecomingInfo);
api.get('/reissuance', reissuance);
api.get('/extensionInfo', extensionInfo);
api.delete('/extensioncancel', extensionCancel);
api.get('/meal', meal);


export default api;