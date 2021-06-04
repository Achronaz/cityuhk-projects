-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- 主機： localhost:3306
-- 產生時間： 2019 年 04 月 22 日 08:47
-- 伺服器版本： 5.7.23
-- PHP 版本： 7.1.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `4280db`
--

-- --------------------------------------------------------

--
-- 資料表結構 `album`
--
DROP DATABASE `4280db`;
CREATE DATABASE IF NOT EXISTS `4280db`;
USE `4280db`;

CREATE TABLE `album` (
  `albumid` int(11) NOT NULL,
  `albumtitle` varchar(255) NOT NULL,
  `artistid` int(11) NOT NULL,
  `coverpath` varchar(255) NOT NULL,
  `genre` varchar(255) NOT NULL,
  `releasedate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `album`
--

INSERT INTO `album` (`albumid`, `albumtitle`, `artistid`, `coverpath`, `genre`, `releasedate`) VALUES
(1, '25', 1, 'x69nb3y5np8dhb6c1c4bd1iaxr8bgjyn.jpg', 'R & B', '2019-04-22 14:28:49'),
(2, '21', 1, 'zjrog7kqpmkcy6pxqkaq9rsqn8bqhc7p.jpg', 'R & B', '2019-04-22 14:29:38'),
(3, 'True', 2, 'g0bhk36pel3n77auyhfb47rtrqzb7lkh.jpg', 'EDM', '2019-04-22 14:30:59'),
(4, 'A Head Full of Dreams', 3, '2skbuiiij6pznx55kme4u3e1plvpijt3.jpg', 'Rock', '2019-04-22 14:32:51'),
(5, 'x', 4, 'hpdj56v51nxvm4u9r8q0ive9p5gztqhj.jpg', 'Pop', '2019-04-22 14:33:57'),
(6, '+', 4, 'p30fnao3a1ehd7nfrsmr1tyco7xrbp8g.jpg', 'Pop', '2019-04-22 14:35:21'),
(7, '÷', 4, '9nw0a34w3abjzi5bmiz3fknonq1sptav.jpg', 'Pop', '2019-04-22 14:36:18'),
(8, 'Kawakiwoameku - EP', 5, 'vi38dwuyae9f8d6ewu0nj76ijnhq8fhh.jpg', 'JPop', '2019-04-22 14:37:36'),
(9, 'Showbiz', 6, '0igbysnxqm7kimf0hiq1cr9bq381ca8g.jpg', 'Rock', '2019-04-22 14:38:57'),
(10, 'This is Acting', 7, 'vqpqjsq4cy7tn1hvgky4yzkrn8rgpobf.jpg', 'Pop', '2019-04-22 14:40:30'),
(11, 'Keep it real', 8, 'p7c3zx8cwzzd125gn4ws6mzwep4op3fm.jpg', 'JPop', '2019-04-22 14:41:50');

-- --------------------------------------------------------

--
-- 資料表結構 `artist`
--

CREATE TABLE `artist` (
  `artistid` int(11) NOT NULL,
  `artistname` varchar(255) NOT NULL,
  `iconpath` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `artist`
--

INSERT INTO `artist` (`artistid`, `artistname`, `iconpath`, `description`) VALUES
(1, 'Adele', 'zwol22b3paf88jvrischrvwsy5xwtv8w.jpg', 'Desc'),
(2, 'Avicii', 'gtjbmx1ootd7zmfuyxmhfcry9bnvycc8.jpg', 'Desc'),
(3, 'Coldplay', 't38d5zo1stq3extrar4rf9bh5uqbk9f2.jpg', 'Desc'),
(4, 'Ed Sheeran', 'tdzqrx80f93j056wivlsefdo31u1xc7z.jpg', 'Desc'),
(5, 'Minami', 'e71ck3z19fdvhvl9ekgtq049zkavrhlf.jpg', 'Desc'),
(6, 'Muse', '37hy2t9hvt0aoe5x6pqsa2neni4ymhgx.jpg', 'Desc'),
(7, 'Sia', 'frzinj9j2vz56kui8j7igzqsvf417ua7.jpg', 'Desc'),
(8, 'ONE OK ROCK', '1wbx4r61pm9thvubqw5i3un65fefpa71.jpg', 'Desc');

-- --------------------------------------------------------

--
-- 資料表結構 `order`
--

CREATE TABLE `order` (
  `orderid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `songid` int(11) DEFAULT NULL,
  `albumid` int(11) DEFAULT NULL,
  `paymentstatus` int(1) NOT NULL,
  `puchasedate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `refund` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `order`
--

INSERT INTO `order` (`orderid`, `userid`, `songid`, `albumid`, `paymentstatus`, `puchasedate`, `refund`) VALUES
(1, 2, NULL, 5, 1, '2019-04-22 15:04:32', 0),
(2, 2, 3, NULL, 2, '2019-04-22 15:05:42', 0),
(3, 2, 16, NULL, 1, '2019-04-22 15:05:58', 0),
(4, 2, NULL, 4, 2, '2019-04-22 15:06:12', 0),
(5, 2, NULL, 3, 1, '2019-04-19 15:06:28', 0),
(6, 2, NULL, 11, 1, '2019-04-22 15:08:47', 0),
(7, 2, NULL, 9, 1, '2019-04-22 15:09:53', 0);

-- --------------------------------------------------------

--
-- 資料表結構 `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('jlpv0NW7_4rz8sd7TAGcCpUqXNEuLgYk', 1555950844, '{\"cookie\":{\"originalMaxAge\":3599999,\"expires\":\"2019-04-22T16:34:04.003Z\",\"httpOnly\":true,\"path\":\"/\",\"sameSite\":true},\"user\":{\"userid\":2,\"username\":\"user01\",\"loyaltypoints\":85,\"permission\":0},\"purchased\":[{\"orderid\":1,\"userid\":2,\"songid\":null,\"albumid\":5,\"paymentstatus\":1,\"puchasedate\":\"2019-04-22T15:04:32.000Z\",\"refund\":0},{\"orderid\":2,\"userid\":2,\"songid\":3,\"albumid\":null,\"paymentstatus\":2,\"puchasedate\":\"2019-04-22T15:05:42.000Z\",\"refund\":0},{\"orderid\":3,\"userid\":2,\"songid\":16,\"albumid\":null,\"paymentstatus\":1,\"puchasedate\":\"2019-04-22T15:05:58.000Z\",\"refund\":0},{\"orderid\":4,\"userid\":2,\"songid\":null,\"albumid\":4,\"paymentstatus\":2,\"puchasedate\":\"2019-04-22T15:06:12.000Z\",\"refund\":0},{\"orderid\":5,\"userid\":2,\"songid\":null,\"albumid\":3,\"paymentstatus\":1,\"puchasedate\":\"2019-04-19T15:06:28.000Z\",\"refund\":0}]}');

-- --------------------------------------------------------

--
-- 資料表結構 `song`
--

CREATE TABLE `song` (
  `songid` int(11) NOT NULL,
  `songtitle` varchar(255) NOT NULL,
  `albumid` int(11) NOT NULL,
  `filepath` varchar(255) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `song`
--

INSERT INTO `song` (`songid`, `songtitle`, `albumid`, `filepath`, `price`) VALUES
(1, 'I Miss You', 1, 't1wzerz2ngzi4x9qzkfcw6d54xxiziaj.m4a', 8),
(2, 'Hello', 1, 'zrt809u27ehwjp0mhebe2giy79zon3ny.m4a', 8),
(3, 'Set Fire To The Rain', 2, 'dlhqf0t55egeym7iz5uljypswhrbda7c.m4a', 8),
(4, 'Someone Like You', 2, 'nn9m71guyfvo8226fslvykoby60d8mdb.m4a', 8),
(5, 'Dear Boy', 3, 'w84p9t37etyzxzdy44opjl9yu7mp9w4q.m4a', 8),
(6, 'Lay Me Down', 3, '86qmmixbhzrw8qesoc7a50dqjkw7si4z.m4a', 8),
(7, 'Hymn for the Weekend', 4, 'l8li7g3p18eop9hq8hrsd28c97ao7pkp.m4a', 8),
(8, 'Adventure of a Lifetime', 4, 'pq5gji5ea4e2try00jvom9ns86fb4cle.m4a', 8),
(9, 'Don\'t', 5, 'a7ez78opx5ha9oluopb7ncnsquybtmyj.m4a', 8),
(10, 'Nina', 5, 'e6fcq0tqkkfeecor323oh5kc4xyzwzg3.m4a', 8),
(11, 'Sing', 5, '3eqrlrmawlht4j2brsx7vat6gspt5kz3.m4a', 8),
(12, 'You Need Me, I Don\'t Need You', 6, 'bqa6c4wftr65nar9mo2v6lx19vl8crcq.m4a', 8),
(13, 'Supermarket Flowers', 7, 'wqpsy62ezla82xk0d376m5fnw268z4me.m4a', 8),
(14, 'Shape of You', 7, 'a8phdm11nt6qvvw30v41hhdg7dv53eh5.m4a', 8),
(15, 'Kawakiwoameku', 8, 'u5ix0p6oto0u0p88beazv0xyjcu4ut8q.m4a', 8),
(16, 'Main Actor', 8, 'byh1p6bm22y7a51czdzsvvici5890pok.m4a', 8),
(17, 'Lilac', 8, 'xkzx2ra4cqsb4qrqzkkn244l6zfaqih9.m4a', 8),
(18, 'Sunburn', 9, 'n24wboj1v4ssavqpg7giahkgpz7hwrtj.m4a', 8),
(19, 'Showbiz', 9, 'q0qq2nx61optw4e4nbvjipqte7wx9vbe.m4a', 8),
(20, 'Bird Set Free', 10, 'yi5zt0p6w7851v95yvns572mv6on2fqb.m4a', 8),
(21, 'Cheap Thrills', 10, 'r6rje5nyxcthdxgx7htskhdehhx6f1tf.m4a', 8),
(22, 'Keep it real', 11, 'l8388l24xf8vjn59gsiyondpd01tj40g.m4a', 8);

-- --------------------------------------------------------

--
-- 資料表結構 `user`
--

CREATE TABLE `user` (
  `userid` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `loyaltypoints` int(11) NOT NULL,
  `permission` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `user`
--

INSERT INTO `user` (`userid`, `username`, `password`, `loyaltypoints`, `permission`) VALUES
(1, 'admin01', '$2b$10$H6IHRZ6r1s6XImaAPCY9.uhkBVfZtxksX10oELiS8C8e4qOabKqyi', 0, 1),
(2, 'user01', '$2b$10$H6IHRZ6r1s6XImaAPCY9.uhkBVfZtxksX10oELiS8C8e4qOabKqyi', 85, 0);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `album`
--
ALTER TABLE `album`
  ADD PRIMARY KEY (`albumid`),
  ADD UNIQUE KEY `unique_albumtitle_artistid` (`albumtitle`,`artistid`),
  ADD KEY `fk_album_artistid` (`artistid`);

--
-- 資料表索引 `artist`
--
ALTER TABLE `artist`
  ADD PRIMARY KEY (`artistid`),
  ADD UNIQUE KEY `unique_artistname` (`artistname`);

--
-- 資料表索引 `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`orderid`),
  ADD UNIQUE KEY `unique_userid_songid` (`userid`,`songid`),
  ADD UNIQUE KEY `unique_userid_albumid` (`userid`,`albumid`),
  ADD KEY `fk_order_songid` (`songid`),
  ADD KEY `fk_order_albumid` (`albumid`),
  ADD KEY `fk_order_userid` (`userid`);

--
-- 資料表索引 `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- 資料表索引 `song`
--
ALTER TABLE `song`
  ADD PRIMARY KEY (`songid`),
  ADD UNIQUE KEY `unique_songtitle_albumid` (`songtitle`,`albumid`),
  ADD KEY `fk_song_songid` (`albumid`);

--
-- 資料表索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userid`),
  ADD UNIQUE KEY `unique_username` (`username`);

--
-- 在傾印的資料表使用自動增長(AUTO_INCREMENT)
--

--
-- 使用資料表自動增長(AUTO_INCREMENT) `album`
--
ALTER TABLE `album`
  MODIFY `albumid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- 使用資料表自動增長(AUTO_INCREMENT) `artist`
--
ALTER TABLE `artist`
  MODIFY `artistid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- 使用資料表自動增長(AUTO_INCREMENT) `order`
--
ALTER TABLE `order`
  MODIFY `orderid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- 使用資料表自動增長(AUTO_INCREMENT) `song`
--
ALTER TABLE `song`
  MODIFY `songid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- 使用資料表自動增長(AUTO_INCREMENT) `user`
--
ALTER TABLE `user`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 已傾印資料表的限制(constraint)
--

--
-- 資料表的限制(constraint) `album`
--
ALTER TABLE `album`
  ADD CONSTRAINT `fk_album_artistid` FOREIGN KEY (`artistid`) REFERENCES `artist` (`artistid`);

--
-- 資料表的限制(constraint) `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `fk_order_songid` FOREIGN KEY (`songid`) REFERENCES `song` (`songid`),
  ADD CONSTRAINT `fk_order_userid` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`);

--
-- 資料表的限制(constraint) `song`
--
ALTER TABLE `song`
  ADD CONSTRAINT `fk_song_songid` FOREIGN KEY (`albumid`) REFERENCES `album` (`albumid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
