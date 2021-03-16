import request from 'request-promise';
import mariadb from 'mariadb';
import dotenv from 'dotenv';
dotenv.config();

const connection = mariadb.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});

const logindms = (async (id,password) => {
  let options = {
    uri: process.env.login_request, 
    method: 'POST',
    body: { id:id, password:password },
    json:true
  };

  request(options).then(async (parsedBody) => {
    console.log(`{${id} 로그인 완료}`);

    let sql = `UPDATE user SET token = 'Bearer ${parsedBody['accessToken']}' WHERE id = binary('${id}');`;
    let rows = connection.query(sql,() =>{connection.end();});    
  });

  return 0;
});

export const login_start = (async () => {
  let sql,rows;
  
  sql = `SELECT id,password FROM user;`;
  rows = await connection.query(sql,() =>{connection.end();});

  for (let i = 0; i < rows.length; i++) {
    await logindms(rows[i]['id'],rows[i]['password']);
  }
});