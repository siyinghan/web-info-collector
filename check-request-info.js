import util from 'util';
import mysql from 'mysql';
import fetch from 'node-fetch';
import { mysqlConfig } from './mysql-config-local.js';
import { value_save } from './value.js';

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
  const weibo_home_info = await fetch(
    'https://weibo.com/ajax/profile/info?uid=' + requesInfo[item]['weibo_uid'],
    {
      headers: {
        Cookie: value_save['weibo_home_cookie'],
      },
    }
  ).then((response) => response.json());
  const weibo_chaohua_info = await fetch(
    'https://m.weibo.cn/api/container/getIndex?extparam=%E9%BE%9A%E4%BF%8A&containerid=' +
      requesInfo[item]['weibo_containerid'] +
      '&luicode=10000011&lfid=100103type%3D401%26t%3D10%26q%3D%E9%BE%9A%E4%BF%8A'
  ).then((response) => response.json());
  const bili_channel_info = await fetch(
    'https://api.bilibili.com/x/web-interface/web/channel/detail?channel_id=' +
      requesInfo[item]['bili_channel_id']
  ).then((response) => response.json());
  const douyin_ch_info = await fetch(
    'https://www.iesdouyin.com/web/api/v2/challenge/info/?ch_id=' +
      requesInfo[item]['douyin_cid']
  ).then((response) => response.json());
  const baidu_index_7days_info = await fetch(
    'https://index.baidu.com/api/SearchApi/index?area=0&word=[[%7B%22name%22:%22' +
      encodeURI(requesInfo[item]['name']) +
      '%22,%22wordType%22:1%7D]]&days=7',
    {
      headers: {
        Cookie: value_save['baidu_index_cookie'],
        'Cipher-Text': value_save['baidu_index_cipher_text'],
      },
    }
  ).then((response) => response.json());

  // extract name information of every response and add into one dictionary to check
  let nameToBeChecked = {};
  nameToBeChecked['name_id'] = item;
  nameToBeChecked['weibo_home_info'] =
    weibo_home_info['data']['user']['screen_name'];
  nameToBeChecked['weibo_chaohua_info'] =
    weibo_chaohua_info['data']['pageInfo']['title_top'];
  if (requesInfo[item]['bili_channel_info']) {
    nameToBeChecked['bili_channel_info'] = bili_channel_info['data']['name'];
  }
  nameToBeChecked['douyin_ch_info'] = douyin_ch_info['ch_info']['cha_name'];
  nameToBeChecked['baidu_index_7days_info'] =
    baidu_index_7days_info['data']['userIndexes'][0]['word'][0]['name'];
  console.log(nameToBeChecked);
}

connection.end();
