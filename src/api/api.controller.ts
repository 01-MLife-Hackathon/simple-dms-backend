import redis from "async-redis";
import {createConnection, getConnection} from "typeorm";
import {logindms, infodms, mealdms} from "../lib/request";

//const connetion = createConnection();
const client = redis.createClient();

//console.log(await getConnection().query(`select * from user where name = '${userInformation}';`););


export const login = (async (ctx,next) => { // 0
  const { id } = ctx.request.body;
  const { password } = ctx.request.body;
  const accessToken = await logindms(id, password);
  let body,status;

  if (accessToken) {
    const userInformation = await infodms(accessToken);
    const user = await getConnection().query(`select * from user where name = '${userInformation}';`);
    
    if (user[0] == undefined) {//유저가 없을경우 신규 계정 생성
      await getConnection().query(`insert user(name, id, password, token) values('${userInformation}','${id}','${password}','default');`);
      await getConnection().query(`insert home(name, homecoming) values('${userInformation}',1);`);
    }

    await client.set(`token-${userInformation}`, accessToken, );
    status = 201;
    body = { "name" : userInformation, "accessToken" : accessToken };
  }else{
    status = 403;
    body = { 
    "errorMessage" : "invalid_account",
    "errorCode" : "E101",
    "errorDescription" : "id 및 password가 일치하지 않음"
    };
  }
  
  ctx.status = status;
  ctx.body = body;
});

export const extension  = (async (ctx,next) => { // 0
  const { name } = ctx.query;
  const { classNum } = ctx.request.body;
  const { seatNum } = ctx.request.body;
  const user = await getConnection().query(`select name from user where name = '${name}';`);
  let body,status,sql,rows;

  if (user[0] != undefined) {
    sql = `select * from extension where name != '${name}' AND classNum = ${classNum} AND seatNum = ${seatNum};`;
    rows = await getConnection().query(sql);
    
    if (rows[0] == undefined) {
      sql = `insert into extension values('${name}', ${classNum}, ${seatNum}) ON DUPLICATE KEY 
      UPDATE classNum = ${classNum}, seatNum = ${seatNum};`;
      await getConnection().query(sql);
      
      status = 201;
      body = {};
    }else{
      status = 403;
      body = {
        "errorMessage" : "invalid_grant",
        "errorCode" : "E303",
        "errorDescription" : "중복 데이터 존재"
      };
    }

  }else{
    status = 412;
    body = {
      "errorMessage" : "invalid_account",
      "errorCode" : "E108",
      "errorDescription" : "존재하지 않는 계정"
    };
  }

  ctx.status = status;
  ctx.body = body;
});

export const homecoming = (async (ctx,next) => { // 0
  const { name } = ctx.query;
  const { value } = ctx.request.body;
  const user = await getConnection().query(`select name from user where name = '${name}';`);
  let body,status,sql;

  console.log(name);
  console.log(value);
  console.log(user);
  
  if (user[0] != undefined) {
    sql = `
    INSERT INTO home(name, homecoming) VALUES ('${name}', ${value}) ON DUPLICATE KEY 
    UPDATE homecoming = ${value};`;
    await getConnection().query(sql);

    status = 201;
    body = {};
  }else{
    status = 412;
    body = {
      "errorMessage" : "invalid_account",
      "errorCode" : "E108",
      "errorDescription" : "존재하지 않는 계정"
    };
  }

  ctx.status = status;
  ctx.body = body;
});

export const homecomingInfo = (async (ctx,next) => {
  const { name } = ctx.query;
  let sql,rows;

  sql = `select * from home where name = '${name}';`;
  rows = await getConnection().query(sql);

  ctx.status = 200;
  ctx.body = rows[0];
});

export const reissuance = (async (ctx,next) => { // 0
  const { name } = ctx.query;
  const user = await getConnection().query(`select name from user where name = '${name}';`);
  let body,status,sql,rows,accessToken;
  

  if (user[0] != undefined) {
    sql = `select id, password from user where name = '${name}';`;
    rows = await getConnection().query(sql);
    
    accessToken = await logindms(rows[0]['id'], rows[0]['password']);
    await client.set(`token-${name}`, accessToken);
    
    status = 201;
    body = { "name" : name, "accessToken" : accessToken };
  }else{
    status = 412;
    body = {
      "errorMessage" : "invalid_account",
      "errorCode" : "E108",
      "errorDescription" : "존재하지 않는 계정"
    };
  }

  ctx.status = status;
  ctx.body = body;
});

export const extensionInfo = (async (ctx,next) => { // 0
  const { classNum } = ctx.query;
  const { name } = ctx.query;
  let sql,rows,status,body;
  
  if (classNum != undefined&& name == undefined) {
    sql = `select * from extension where classNum = '${classNum}' order by seatNum;`;
    status = 200
    body = await getConnection().query(sql);

  }else if(classNum == undefined&& name != undefined){
    sql = `select * from extension where name = '${name}';`;
    status = 200
    rows = await getConnection().query(sql);
    
    if (rows[0] != undefined) {
      body = true;
    }else{
      body = false;
    }
  }else{
    status = 400;
    body = {
      errorMessage : "E401",
      errorCode : "invalid_from",
      errorDescription : "잘못된 형식의 요청"
    };
  }

  ctx.status = status;
  ctx.body = body;
});

export const extensionCancel  = (async (ctx,next) => { // 0
  const { name } = ctx.query;
  const user = await getConnection().query(`select name from user where name = '${name}';`);
  let body,status,sql;

  if (user[0] != undefined) {
    sql = `delete from extension where name = '${name}';`;
    await getConnection().query(sql);
    
    status = 201;
    body = {};
  }else{
    status = 412;
    body = {
      "errorMessage" : "invalid_account",
      "errorCode" : "E108",
      "errorDescription" : "존재하지 않는 계정"
    };
  }

  ctx.status = status;
  ctx.body = body;
});

export const meal = (async (ctx,next) => { // 0
  let meal = await mealdms();

  ctx.status = 200;
  ctx.body = meal;
});