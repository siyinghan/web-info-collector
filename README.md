# Web Info Collector

## Getting Started

Run `npm install` to install dependencies.

Run `node index.js` to execute the code.

Data will be stored in the MySQL table.

## MySQL table

#### request_info

```mysql
CREATE TABLE `request_info` (
  `name_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `weibo_uid` bigint(20) DEFAULT NULL,
  `weibo_containerid` varchar(45) DEFAULT NULL,
  `bili_channel_id` int(11) DEFAULT NULL,
  `douyin_cid` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`name_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

#### web_data

```mysql
CREATE TABLE `web_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name_id` int(11) DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT current_timestamp(),
  `year` int(4) DEFAULT NULL,
  `month` int(2) unsigned zerofill DEFAULT NULL,
  `day` int(2) unsigned zerofill DEFAULT NULL,
  `weibo_follower` int(11) DEFAULT NULL,
  `weibo_friend` int(11) DEFAULT NULL,
  `weibo_count` int(11) DEFAULT NULL,
  `weibo_song` varchar(45) DEFAULT NULL,
  `weibo_yesterday` varchar(45) DEFAULT NULL,
  `weibo_video` varchar(45) DEFAULT NULL,
  `chaohua_read_yi` float(8,1) DEFAULT NULL,
  `chaohua_count` int(11) DEFAULT NULL,
  `chaohua_follower_wan` float(8,1) DEFAULT NULL,
  `bili_channel_archive_count_wan` float(8,1) DEFAULT NULL,
  `bili_channel_view_count_yi` float(8,1) DEFAULT NULL,
  `bili_channel_feature_count` int(11) DEFAULT NULL,
  `bili_channel_subscription` int(11) DEFAULT NULL,
  `douyin_ch_user_count` int(11) DEFAULT NULL,
  `douyin_ch_view_count` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
