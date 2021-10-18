
//1. npm install oracledb --save
//2. instantclient다운로드 : https://www.oracle.com/kr/database/technologies/instant-client/downloads.html
var express = require('express');
var router = express.Router();
var oracledb = require("oracledb");
oracledb.autoCommit = true;

try {
    oracledb.initOracleClient({libDir: 'D:\\instantclient_18_5'});  // window7은 18버전 사용
} catch (err) {
    console.error('Whoops!');
    console.error(err);
    process.exit(1);
}


var conn;
//오라클 접속
oracledb.getConnection({
    user:"id311",
    password:"pw311",
    connectString:"1.234.5.158:11521/xe" 
},function(err,con){
  console.log(con);
    if(err){
        console.log("접속이 실패했습니다.", err);
    }
    conn = con;

    conn.execute("select * from MEMBER", function(err, result)  {
        if (err) { 
          console.error(err); 
          return; 
        }
        console.log(result.rows[0][0]);
        console.log(result.rows);
    });
});

module.exports = router;

