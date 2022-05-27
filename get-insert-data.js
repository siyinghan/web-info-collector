import fetch from 'node-fetch';

export const getAllData = async (
  name_id,
  weibo_uid,
  weibo_containerid,
  bili_channel_id,
  douyin_cid
) => {
  let allData = {};
  // insert current date
  const date = new Date();
  allData['year'] = date.getFullYear();
  allData['month'] = date.getMonth() + 1;
  allData['day'] = date.getDate();
  // insert web info
  allData['name_id'] = name_id;
  const weiboUserInfo = await getWeiboUserInfo(weibo_uid);
  const weiboUserDetail = await getWeiboUserDetail(weibo_uid);
  const weiboChaohuaInfo = await getWeiboChaohuaInfo(weibo_containerid);
  let biliChanneInfo = {};
  if (bili_channel_id) {
    biliChanneInfo = await getBiliChanneInfo(bili_channel_id);
  }
  const douyinTagInfo = await getDouyinTagInfo(douyin_cid);
  for (let info in weiboUserInfo) {
    allData[info] = weiboUserInfo[info];
  }
  for (let info in weiboUserDetail) {
    allData[info] = weiboUserDetail[info];
  }
  for (let info in weiboChaohuaInfo) {
    allData[info] = weiboChaohuaInfo[info];
  }
  for (let info in biliChanneInfo) {
    allData[info] = biliChanneInfo[info];
  }
  for (let info in douyinTagInfo) {
    allData[info] = douyinTagInfo[info];
  }
  return allData;
};

const getWeiboUserInfo = async (uid) => {
  const url = 'https://weibo.com/ajax/profile/info?uid=' + uid;
  const weibo_info_response = await fetch(url, {
    method: 'GET',
    headers: {
      Cookie:
        'PC_TOKEN=a37ab312d2; SUB=_2AkMV1v-Ff8NxqwFRmP8VyWPhZYl_zA7EieKjig5eJRMxHRl-yT92qkEStRB6PlbRanatp6A8fTCaEbx4c9Y9c8gE09xW; SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9WFJ_4rAXyYkIU2ZRHPn0nJ6; XSRF-TOKEN=ng6zLcS3sAs9V7vtEZb03wCm; WBPSESS=dg5zs_KFY81p0FnDKmb34beZzdP0zt_lcZBtw2BztAtpHEm1lxohB65MR21jldoxxdt-irfjq1wUPI6B-rhWgCWaHOc5XFKMmmUbvkKtkpo97c_LbCmMUV1MA18W47_1oOIFV5KOi6XdjXdzDm4w-SgD5HDS0506yRpUIv2bEeM=',
    },
  }).then((response) => response.json());
  return {
    weibo_follower: weibo_info_response.data.user.followers_count,
    weibo_friend: weibo_info_response.data.user.friends_count,
    weibo_count: weibo_info_response.data.user.statuses_count,
  };
};

const getWeiboUserDetail = async (uid) => {
  const url = 'https://weibo.com/ajax/profile/detail?uid=' + uid;
  const weibo_detail_response = await fetch(url, {
    method: 'GET',
    headers: {
      Cookie:
        'PC_TOKEN=a37ab312d2; SUB=_2AkMV1v-Ff8NxqwFRmP8VyWPhZYl_zA7EieKjig5eJRMxHRl-yT92qkEStRB6PlbRanatp6A8fTCaEbx4c9Y9c8gE09xW; SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9WFJ_4rAXyYkIU2ZRHPn0nJ6; XSRF-TOKEN=ng6zLcS3sAs9V7vtEZb03wCm; WBPSESS=dg5zs_KFY81p0FnDKmb34beZzdP0zt_lcZBtw2BztAtpHEm1lxohB65MR21jldoxxdt-irfjq1wUPI6B-rhWgCWaHOc5XFKMmmUbvkKtkpo97c_LbCmMUV1MA18W47_1oOIFV5KOi6XdjXdzDm4w-SgD5HDS0506yRpUIv2bEeM=',
    },
  }).then((response) => response.json());
  let weibo_detail = {};
  weibo_detail_response.data.label_desc.forEach((detail) => {
    if (detail['name'].indexOf('歌') !== -1) {
      weibo_detail['weibo_song'] = detail['name'];
    } else if (detail['name'].indexOf('昨日') !== -1) {
      weibo_detail['weibo_yesterday'] = detail['name'];
    } else if (detail['name'].indexOf('视频') !== -1) {
      weibo_detail['weibo_video'] = detail['name'].match(/[0-9].+/)[0];
    }
  });
  return weibo_detail;
};

const getWeiboChaohuaInfo = async (containerid) => {
  const url =
    'https://m.weibo.cn/api/container/getIndex?extparam=%E9%BE%9A%E4%BF%8A&containerid=' +
    containerid +
    '&luicode=10000011&lfid=100103type%3D401%26t%3D10%26q%3D%E9%BE%9A%E4%BF%8A';
  const weibo_chaohua_response = await fetch(url).then((response) =>
    response.json()
  );
  return {
    chaohua_read_yi: weibo_chaohua_response.data.pageInfo.desc_more[0]
      .split('\u3000')[0]
      .match(/[0-9.]+/)[0],
    chaohua_count: weibo_chaohua_response.data.pageInfo.total,
    chaohua_follower_wan: weibo_chaohua_response.data.pageInfo.desc_more[0]
      .split('\u3000')[2]
      .match(/[0-9.]+/)[0],
  };
};

const getBiliChanneInfo = async (channel_id) => {
  const url =
    'https://api.bilibili.com/x/web-interface/web/channel/detail?channel_id=' +
    channel_id;
  const bili_channel_response = await fetch(url).then((response) =>
    response.json()
  );
  return {
    bili_channel_archive_count_wan:
      bili_channel_response.data.archive_count.match(/[0-9.]+/)[0],
    bili_channel_view_count_yi:
      bili_channel_response.data.view_count.match(/[0-9.]+/)[0],
    bili_channel_feature_count: bili_channel_response.data.featured_count,
    bili_channel_subscription: bili_channel_response.data.subscribed_count,
  };
};

const getDouyinTagInfo = async (cid) => {
  const url =
    'https://www.iesdouyin.com/web/api/v2/challenge/info/?ch_id=' + cid;
  const douyin_tag_response = await fetch(url).then((response) =>
    response.json()
  );
  return {
    douyin_ch_user_count: douyin_tag_response.ch_info.user_count,
    douyin_ch_view_count: douyin_tag_response.ch_info.view_count,
  };
};
