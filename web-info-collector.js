import fetch from 'node-fetch';
import { items } from './request-info.js';

export class WebInfoCollector {
  async webInfoCombine(item) {
    let allInfo = {};
    const weiboUserInfo = await this.getWeiboUserInfo(items[item].weibo_uid);
    const weiboUserDetail = await this.getWeiboUserDetail(
      items[item].weibo_uid
    );
    const weiboChaohuaInfo = await this.getWeiboChaohuaInfo(
      items[item].weibo_containerid
    );
    let biliChanneInfo = {};
    if (items[item].bili_channel_id) {
      biliChanneInfo = await this.getBiliChanneInfo(
        items[item].bili_channel_id
      );
    }
    const douyinTagInfo = await this.getDouyinTagInfo(items[item].douyin_cid);
    for (let info in weiboUserInfo) {
      allInfo[info] = weiboUserInfo[info];
    }
    for (let info in weiboUserDetail) {
      allInfo[info] = weiboUserDetail[info];
    }
    for (let info in weiboChaohuaInfo) {
      allInfo[info] = weiboChaohuaInfo[info];
    }
    for (let info in biliChanneInfo) {
      allInfo[info] = biliChanneInfo[info];
    }
    for (let info in douyinTagInfo) {
      allInfo[info] = douyinTagInfo[info];
    }
    return allInfo;
  }

  async getWeiboUserInfo(uid) {
    const url = 'https://weibo.com/ajax/profile/info?uid=' + uid;
    const weibo_info_response = await fetch(url, {
      method: 'GET',
      headers: {
        Cookie:
          'PC_TOKEN=c1170f02e5; SUB=_2AkMVNrbxf8NxqwFRmP4czWzqbo91zwHEieKjakcqJRMxHRl-yT92qlQbtRB6PraYHj83uolEEn2U1VvuPvVaMhuY1yim; SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9WWVo8AAKaceJj8hQm-pvmoB; XSRF-TOKEN=j-G5mGmBeN9OtElv1VkAejTJ; WBPSESS=g2Va6ZLXRYSCdsm5QPfA3BkVoGy9gGA1z9_wY_YktkQ-jiJKp_s9cWZ0net5sTEgRv7ZPFSOYhw49Gb5exlQnAWGUHo3cb1Jj7aTyC8Az0ye3bYnI83y4zv732D0fSCEaJjTPcsxhkRXKO5z9wiZR7X6wH3s9hzNwv-F-smIkXY=',
      },
    }).then((response) => response.json());
    return {
      weibo_follower: weibo_info_response.data.user.followers_count,
      weibo_friend: weibo_info_response.data.user.friends_count,
      weibo_count: weibo_info_response.data.user.statuses_count,
    };
  }

  async getWeiboUserDetail(uid) {
    const url = 'https://weibo.com/ajax/profile/detail?uid=' + uid;
    const weibo_detail_response = await fetch(url, {
      method: 'GET',
      headers: {
        Cookie:
          'PC_TOKEN=c1170f02e5; SUB=_2AkMVNrbxf8NxqwFRmP4czWzqbo91zwHEieKjakcqJRMxHRl-yT92qlQbtRB6PraYHj83uolEEn2U1VvuPvVaMhuY1yim; SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9WWVo8AAKaceJj8hQm-pvmoB; XSRF-TOKEN=j-G5mGmBeN9OtElv1VkAejTJ; WBPSESS=g2Va6ZLXRYSCdsm5QPfA3BkVoGy9gGA1z9_wY_YktkQ-jiJKp_s9cWZ0net5sTEgRv7ZPFSOYhw49Gb5exlQnAWGUHo3cb1Jj7aTyC8Az0ye3bYnI83y4zv732D0fSCEaJjTPcsxhkRXKO5z9wiZR7X6wH3s9hzNwv-F-smIkXY=',
      },
    }).then((response) => response.json());
    let weibo_detail = {};
    weibo_detail_response.data.label_desc.forEach((detail) => {
      if (detail['name'].indexOf('歌') !== -1) {
        weibo_detail['weibo_song'] = detail['name'];
      } else if (detail['name'].indexOf('昨日') !== -1) {
        weibo_detail['weibo_yesterday'] = detail['name'];
      } else if (detail['name'].indexOf('视频') !== -1) {
        weibo_detail['weibo_video'] = detail['name'];
      }
    });
    return weibo_detail;
  }

  async getWeiboChaohuaInfo(containerid) {
    const url =
      'https://m.weibo.cn/api/container/getIndex?extparam=%E9%BE%9A%E4%BF%8A&containerid=' +
      containerid +
      '&luicode=10000011&lfid=100103type%3D401%26t%3D10%26q%3D%E9%BE%9A%E4%BF%8A';
    const weibo_chaohua_response = await fetch(url).then((response) =>
      response.json()
    );
    return {
      chaohua_read:
        weibo_chaohua_response.data.pageInfo.desc_more[0].split('\u3000')[0],
      chaohua_count: weibo_chaohua_response.data.pageInfo.total,
      chaohua_follower:
        weibo_chaohua_response.data.pageInfo.desc_more[0].split('\u3000')[2],
      // Number(JSON.stringify(weibo_chaohua_response).match(/"content2":"([0-9]+)/)[1]),
    };
  }

  async getBiliChanneInfo(channel_id) {
    const url =
      'https://api.bilibili.com/x/web-interface/web/channel/detail?channel_id=' +
      channel_id;
    const bili_channel_response = await fetch(url).then((response) =>
      response.json()
    );
    return {
      bili_channel_archive_count: bili_channel_response.data.archive_count,
      bili_channel_view_count: bili_channel_response.data.view_count,
      bili_channel_feature_count: bili_channel_response.data.featured_count,
      bili_channel_subscription: bili_channel_response.data.subscribed_count,
    };
  }

  async getDouyinTagInfo(cid) {
    const url =
      'https://www.iesdouyin.com/web/api/v2/challenge/info/?ch_id=' + cid;
    const douyin_tag_response = await fetch(url).then((response) =>
      response.json()
    );
    return {
      douyin_ch_user_count: douyin_tag_response.ch_info.user_count,
      douyin_ch_view_count: douyin_tag_response.ch_info.view_count,
    };
  }
}
