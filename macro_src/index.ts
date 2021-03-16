import schedule from 'node-schedule';
import mariadb from 'mariadb';
import dotenv from 'dotenv';
dotenv.config();

import { login_start } from './lib/login';
import { apply_start } from './lib/request';

const connection = mariadb.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});

schedule.scheduleJob ('00 25 17 * * *', async () =>{
  console.log("요청 시작");
  await login_start();
  console.log("로그인 완료");
});


schedule.scheduleJob ('00 30 17 * * *', async () =>{
  let sql,rows;
  sql = `SELECT user.token, extension.classNum, extension.seatNum 
  FROM user join extension
  ON user.name = extension.name;`;
  rows = await connection.query(sql,() =>{connection.end();});

  console.log("요청 시작");
  for (let i = 0; i < rows.length; i++) {
    await apply_start(rows[i]['token'], rows[i]['classNum'], rows[i]['seatNum']);
    console.log(i + "번째 연장신청 완료");
  }
});

