# Web Info Collector

## Getting Started

Run `npm install` to install dependencies.

Run `node index.js` to execute the code.

All requested nformation will be stored in the MySQL table.

## MySQL table setting

```mysql
CREATE TABLE `xxx` (
  `id` int NOT NULL AUTO_INCREMENT,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `weibo_follower` int DEFAULT NULL,
  `weibo_friend` int DEFAULT NULL,
  `weibo_count` int DEFAULT NULL,
  `weibo_song` varchar(45) DEFAULT NULL,
  `weibo_yesterday` varchar(45) DEFAULT NULL,
  `weibo_video` varchar(45) DEFAULT NULL,
  `chaohua_read` varchar(20) DEFAULT NULL,
  `chaohua_count` int DEFAULT NULL,
  `chaohua_follower` VARCHAR(20) DEFAULT NULL,
  `bili_channel_archive_count` varchar(10) DEFAULT NULL,
  `bili_channel_view_count` varchar(10) DEFAULT NULL,
  `bili_channel_feature_count` int DEFAULT NULL,
  `bili_channel_subscription` int DEFAULT NULL,
  `douyin_ch_user_count` int DEFAULT NULL,
  `douyin_ch_view_count` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
)
```

## Example

| id  | create_time         | weibo_follower | weibo_friend | weibo_count | weibo_song             | weibo_yesterday                     | weibo_video            | chaohua_read  | chaohua_count | chaohua_follower | bili_channel_archive_count | bili_channel_view_count | bili_channel_feature_count | bili_channel_subscription | douyin_ch_user_count | douyin_ch_view_count |
| --- | ------------------- | -------------- | ------------ | ----------- | ---------------------- | ----------------------------------- | ---------------------- | ------------- | ------------- | ---------------- | -------------------------- | ----------------------- | -------------------------- | ------------------------- | -------------------- | -------------------- |
| 1   | 2022-05-15 23:05:40 | 33468417       | 165          | 678         | 亚洲新歌榜 内地榜 No.4 | 昨日阅读人数 100 万+，互动数 4.3 万 | 视频累计播放量 4.16 亿 | 阅读 324.9 亿 | 990769        | 粉丝 551.5 万    | 8.2 万                     | 14.4 亿                 | 775                        | 75679                     | 500047               | 26962922191          |

## Cookie

Open [weibo](https://weibo.com) in incognito mode. Inspect any user homepage, click `detail?uid=` and copy the cookie.
