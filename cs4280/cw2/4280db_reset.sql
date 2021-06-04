DROP DATABASE `4280db`;
CREATE DATABASE IF NOT EXISTS `4280db`;
USE `4280db`;

DROP TABLE IF EXISTS `album`;
CREATE TABLE IF NOT EXISTS `album` (
  `albumid` int(11) NOT NULL AUTO_INCREMENT,
  `albumtitle` varchar(255) NOT NULL,
  `artistid` int(11) NOT NULL,
  `coverpath` varchar(255) NOT NULL,
  `genre` varchar(255) NOT NULL,
  `releasedate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`albumid`),
  KEY `fk_album_artistid` (`artistid`)
);

DROP TABLE IF EXISTS `artist`;
CREATE TABLE IF NOT EXISTS `artist` (
  `artistid` int(11) NOT NULL AUTO_INCREMENT,
  `artistname` varchar(255) NOT NULL,
  `iconpath` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`artistid`)
);

DROP TABLE IF EXISTS `order`;
CREATE TABLE IF NOT EXISTS `order` (
  `orderid` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `songid` int(11) DEFAULT NULL,
  `albumid` int(11) DEFAULT NULL,
  `paymentstatus` int(1) NOT NULL,
  `puchasedate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `refund` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`orderid`),
  KEY `fk_order_songid` (`songid`),
  KEY `fk_order_albumid` (`albumid`),
  KEY `fk_order_userid` (`userid`)
);

DROP TABLE IF EXISTS `song`;
CREATE TABLE IF NOT EXISTS `song` (
  `songid` int(11) NOT NULL AUTO_INCREMENT,
  `songtitle` varchar(255) NOT NULL,
  `albumid` int(11) NOT NULL,
  `filepath` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  PRIMARY KEY (`songid`),
  KEY `fk_song_songid` (`albumid`)
);

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `loyaltypoints` int(11) NOT NULL,
  `permission` int(1) NOT NULL,
  PRIMARY KEY (`userid`)
);

ALTER TABLE `user` 
  ADD CONSTRAINT `unique_username` UNIQUE(`username`);

ALTER TABLE `artist` 
  ADD CONSTRAINT `unique_artistname` UNIQUE(`artistname`);

ALTER TABLE `album`
  ADD CONSTRAINT `fk_album_artistid` FOREIGN KEY (`artistid`) REFERENCES `artist` (`artistid`),
  ADD CONSTRAINT `unique_albumtitle_artistid` UNIQUE(`albumtitle`, `artistid`);

ALTER TABLE `order`
  ADD CONSTRAINT `fk_order_songid` FOREIGN KEY (`songid`) REFERENCES `song` (`songid`),
  ADD CONSTRAINT `fk_order_userid` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`),
  ADD CONSTRAINT `unique_userid_songid` UNIQUE(`userid`, `songid`),
  ADD CONSTRAINT `unique_userid_albumid` UNIQUE(`userid`, `albumid`);

ALTER TABLE `song`
  ADD CONSTRAINT `fk_song_songid` FOREIGN KEY (`albumid`) REFERENCES `album` (`albumid`),
  ADD CONSTRAINT `unique_songtitle_albumid` UNIQUE(`songtitle`, `albumid`);

INSERT INTO `user` VALUES(DEFAULT, 'admin01','$2b$10$H6IHRZ6r1s6XImaAPCY9.uhkBVfZtxksX10oELiS8C8e4qOabKqyi',0,1);
INSERT INTO `user` VALUES(DEFAULT, 'user01','$2b$10$H6IHRZ6r1s6XImaAPCY9.uhkBVfZtxksX10oELiS8C8e4qOabKqyi',100,0);
COMMIT;