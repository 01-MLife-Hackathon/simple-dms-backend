import redis from "redis";
import {createConnection, getConnection} from "typeorm";
import {logindms, infodms} from "../lib/request";

const connetion = createConnection();
const client = redis.createClient();


export const login = (async (ctx,next) => { // 0
  const { id } = ctx.request.body;
  const { password } = ctx.request.body;
  const accessToken = await logindms(id, password);
  let body,status;

  if (accessToken) {
    const userInformation = await infodms(accessToken);
    const user = await getConnection().query(`select * from user where name = '${userInformation}';`);
    
    if (user[0] == undefined) {//유저가 없을경우 신규 계정 생성
      await getConnection().query(`insert user(name, id, password) values('${userInformation}','${id}','${password}');`);
    }
    
    await client.set(`token-${userInformation}`, accessToken);
    status = 201;
    body = { "name" : userInformation, "accessToken" : accessToken };
  }else{
    status = 403;
    body = { 
    "errorMessage" : "invalid_account",
    "errorCode" : "E101",
    "errorDescription" : "id 및 password가 일치하지 않음",
    };
  }
  
  ctx.status = status;
  ctx.body = body;
});

export const extension  = (async (ctx,next) => {
  console.log("asdasdasdad");
  

  ctx.status = 200;
  ctx.body = 'body';
});

export const homecoming = (async (ctx,next) => {
  console.log("asdasdasdad");
  

  ctx.status = 200;
  ctx.body = 'body';
});

export const reissuance = (async (ctx,next) => {
  console.log("asdasdasdad");
  

  ctx.status = 200;
  ctx.body = 'body';
});