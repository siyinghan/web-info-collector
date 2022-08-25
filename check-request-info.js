import util from 'util';
import mysql from 'mysql';
import fetch from 'node-fetch';
import { mysqlConfig } from './mysql-config-local.js';

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
  const weibo_home_info = await fetch(
    'https://weibo.com/ajax/profile/info?uid=' + requesInfo[item]['weibo_uid'],
    {
      method: 'GET',
      headers: {
        Cookie:
          'PC_TOKEN=a37ab312d2; SUB=_2AkMV1v-Ff8NxqwFRmP8VyWPhZYl_zA7EieKjig5eJRMxHRl-yT92qkEStRB6PlbRanatp6A8fTCaEbx4c9Y9c8gE09xW; SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9WFJ_4rAXyYkIU2ZRHPn0nJ6; XSRF-TOKEN=ng6zLcS3sAs9V7vtEZb03wCm; WBPSESS=dg5zs_KFY81p0FnDKmb34beZzdP0zt_lcZBtw2BztAtpHEm1lxohB65MR21jldoxxdt-irfjq1wUPI6B-rhWgCWaHOc5XFKMmmUbvkKtkpo97c_LbCmMUV1MA18W47_1oOIFV5KOi6XdjXdzDm4w-SgD5HDS0506yRpUIv2bEeM=',
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
  console.log(nameToBeChecked);
}

connection.end();
