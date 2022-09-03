import util from 'util';
import mysql from 'mysql';
import { mysqlConfig } from './mysql-config/mysql-config-server.js';
import { getAllData } from './get-insert-data.js';

const connection = mysql.createConnection(mysqlConfig);
const queryMySQL = util.promisify(connection.query).bind(connection);

const sqlGetRequestInfo = 'SELECT * FROM request_info';
const requesInfoRaw = await queryMySQL(sqlGetRequestInfo);

let requesInfo = {};
requesInfoRaw.forEach((item) => {
  const { name_id, weibo_uid, weibo_containerid, bili_channel_id, douyin_cid } =
    item;
  requesInfo[name_id] = {
    weibo_uid: weibo_uid,
    weibo_containerid: weibo_containerid,
    bili_channel_id: bili_channel_id,
    douyin_cid: douyin_cid,
  };
});

for (let item in requesInfo) {
  if (item > 0) {
    const sqlInsertData = 'INSERT INTO web_data SET ?';
    const insertData = await getAllData(
      parseInt(item),
      requesInfo[item]['weibo_uid'],
      requesInfo[item]['weibo_containerid'],
      requesInfo[item]['bili_channel_id'],
      requesInfo[item]['douyin_cid']
    );
    console.log(insertData);
    queryMySQL(sqlInsertData, insertData);
  }
}

connection.end();
