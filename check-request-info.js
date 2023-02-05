import util from 'util';
import mysql from 'mysql';
import fetch from 'node-fetch';
import { mysqlConfig } from './mysql-config/mysql-config-local.js';
import { value_save } from './value.js';

const connection = mysql.createConnection(mysqlConfig);
const queryMySQL = util.promisify(connection.query).bind(connection);

const sqlGetRequestInfo = 'SELECT * FROM request_info';
const requestInfoRaw = await queryMySQL(sqlGetRequestInfo);

let requestInfo = {};
requestInfoRaw.forEach((item) => {
  const {
    name_id,
    name,
    weibo_uid,
    weibo_containerid,
    bili_channel_id,
    douyin_cid,
    status,
  } = item;
  requestInfo[name_id] = {
    name: name,
    weibo_uid: weibo_uid,
    weibo_containerid: weibo_containerid,
    bili_channel_id: bili_channel_id,
    douyin_cid: douyin_cid,
    status: status,
  };
});

for (let item in requestInfo) {
  if (requestInfo[item]['status'] === 0) continue;
  const weibo_home_info = await fetch(
    'https://weibo.com/ajax/profile/info?uid=' + requestInfo[item]['weibo_uid'],
    {
      headers: {
        Cookie: value_save['weibo_home_cookie'],
      },
    }
  ).then((response) => response.json());
  const weibo_chaohua_info = await fetch(
    'https://m.weibo.cn/api/container/getIndex?extparam=%E9%BE%9A%E4%BF%8A&containerid=' +
      requestInfo[item]['weibo_containerid'] +
      '&luicode=10000011&lfid=100103type%3D401%26t%3D10%26q%3D%E9%BE%9A%E4%BF%8A'
  ).then((response) => response.json());
  const bili_channel_info = await fetch(
    'https://api.bilibili.com/x/web-interface/web/channel/detail?channel_id=' +
      requestInfo[item]['bili_channel_id']
  ).then((response) => response.json());
  const douyin_ch_info = await fetch(
    'https://www.iesdouyin.com/web/api/v2/challenge/info/?ch_id=' +
      requestInfo[item]['douyin_cid']
  ).then((response) => response.json());

  // extract name information of every response and add into one dictionary to check
  let nameToBeChecked = {};
  nameToBeChecked['name_id'] = item;
  nameToBeChecked['weibo_home_info'] =
    weibo_home_info['data']['user']['screen_name'];
  nameToBeChecked['weibo_chaohua_info'] =
    weibo_chaohua_info['data']['pageInfo']['title_top'];
  if (requestInfo[item]['bili_channel_info']) {
    nameToBeChecked['bili_channel_info'] = bili_channel_info['data']['name'];
  }
  nameToBeChecked['douyin_ch_info'] = douyin_ch_info['ch_info']['cha_name'];
  console.log(nameToBeChecked);
}

connection.end();
