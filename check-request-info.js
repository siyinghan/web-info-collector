import util from 'util';
import mysql from 'mysql';
import { mysqlConfig } from './mysql-config.js';
import { getRequestInfo } from './test/get-request-info.js';

const connection = mysql.createConnection(mysqlConfig);
const queryMySQL = util.promisify(connection.query).bind(connection);

const sqlGetRequestInfo = 'SELECT * FROM request_info';
const requesInfoRaw = await queryMySQL(sqlGetRequestInfo);

let requesInfo = {};
requesInfoRaw.forEach((item) => {
  const {
    name_id,
    name,
    weibo_uid,
    weibo_containerid,
    bili_channel_id,
    douyin_cid,
  } = item;
  requesInfo[name_id] = {
    name: name,
    weibo_uid: weibo_uid,
    weibo_containerid: weibo_containerid,
    bili_channel_id: bili_channel_id,
    douyin_cid: douyin_cid,
  };
});

for (let item in requesInfo) {
  const name = requesInfo[item].name;

  const checkInfo = await getRequestInfo(
    requesInfo[item]['weibo_uid'],
    requesInfo[item]['weibo_containerid'],
    requesInfo[item]['bili_channel_id'],
    requesInfo[item]['douyin_cid']
  );
  console.log(name);
  console.log(checkInfo);
}

connection.end();
