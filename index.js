import mysql from 'mysql';
import { WebInfoCollector } from './web-info-collector.js';
import { items } from './request-info.js';

const connection = mysql.createConnection({
  user: 'root',
  host: '192.168.1.100',
  database: 'web_info',
  password: 'Admin1234!',
});

for (let item in items) {
  const sqlStr = 'INSERT INTO ' + item + ' SET ?';
  const insert_data = await new WebInfoCollector().webInfoCombine(item);
  console.log(item);
  console.log(insert_data);
  connection.query(sqlStr, insert_data, (err, results) => {
    if (err) throw err;
    if (results.affectedRows === 1) {
      console.log('success');
    }
  });
}

connection.end();
