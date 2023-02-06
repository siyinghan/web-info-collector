# Web Info Collector

## Quickstart

Run `npm install` to install dependencies.

Run `node index.js` to collect information.

- Use mysqlConfig from `./mysql-config-local.js` when running the code in local.
- Use mysqlConfig from `./mysql-config-server.js` when running the code in server.

The tables in MySQL need to be created before running the code. And the collected data will be stored in the corresponding tables.

Run `node check-request-info.js` to check if the request info in the request_info table is correct.

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
  `status` int(1) DEFAULT 1,
  PRIMARY KEY (`name_id`)
  UNIQUE KEY `name_id` (`name_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

#### web_data

```mysql
CREATE TABLE `web_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name_id` int(11) DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT current_timestamp(),
  `weibo_follower` int(11) DEFAULT NULL,
  `weibo_friend` int(11) DEFAULT NULL,
  `weibo_count` int(11) DEFAULT NULL,
  `v_index_wenyu` float(5,2) DEFAULT NULL,
  `weibo_song` varchar(45) DEFAULT NULL,
  `weibo_yesterday` varchar(45) DEFAULT NULL,
  `weibo_video` varchar(45) DEFAULT NULL,
  `chaohua_read_yi` float(8,1) DEFAULT NULL,
  `chaohua_count_wan` float(8,1) DEFAULT NULL,
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
