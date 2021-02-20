import request from 'request-promise';
import {createConnection, getConnection} from "typeorm";
import dotenv from 'dotenv';
dotenv.config();

const connetion = createConnection();

export const logindms = (async (id,password) => {
  let accessToken;
  let options = {
    uri: process.env.login_request, 
    method: 'POST',
    body: { id:id, password:password,},
    json:true
  };

  await request(options).then(async (parsedBody) => {
    console.log(`로그인 완료`);
    console.log(parsedBody);
    
    if (parsedBody == undefined) {
      accessToken = false;
    }else{
      accessToken = parsedBody['accessToken'];
    }
  });
  
  return accessToken;
});

export const infodms = (async (accessToken) => {
  let name;
  let options = {
    uri: process.env.info_request, 
    method: 'GET',
    headers: { authorization: `Bearer ${accessToken}`, },
    json:true
  };

  await request(options).then(async (parsedBody) => {
    console.log(`정보 불러오기 완료`);
    console.log(parsedBody);
    
    if (parsedBody == undefined) {
      name = false;
    }else{
      name = `${parsedBody['number']}${parsedBody['name']}`;
    }
  });
  
  return name;
});

export const mealdms = (async () => {
  let meal;
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let date = today.getDate(); 

  let options = {
    uri: `${process.env.date_request}${year}-${month}-${date}`, 
    method: 'GET',
    json:true
  };

  await request(options).then(async (parsedBody) => {
    console.log(`정보 불러오기 완료`);
    console.log(parsedBody);
    
    if (parsedBody == undefined) {
      meal = false;
    }else{
      meal = parsedBody[`${year}-${month}-${date}`];
    }
  });
  
  return meal;
});
