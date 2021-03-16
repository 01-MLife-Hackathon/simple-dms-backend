import request from 'request';
import dotenv from 'dotenv';
dotenv.config();

let options = { 
  uri: process.env.apply12_request, 
  method: 'POST', 
  headers: { authorization: 'Bearer' }, 
  body: { classNum: 8, seatNum: 1,}, 
  json:true 
};

export const apply_start = (async (authorization, classNum, seatNum) => {
  options['headers']['authorization'] = authorization;
  options['body']['classNum'] = classNum;
  options['body']['seatNum'] = seatNum;

  request.post(options);

  return 0;
});
