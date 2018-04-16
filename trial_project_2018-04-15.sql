# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.21)
# Database: trial_project
# Generation Time: 2018-04-14 16:46:19 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `salt` varchar(255) NOT NULL,
  `encrypted_password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;

INSERT INTO `user` (`id`, `username`, `created_at`, `updated_at`, `salt`, `encrypted_password`)
VALUES
	(6,'hello','2018-03-31 14:14:03','2018-03-31 14:14:03','b15c7388','9be477243178505695313ae0c03b0065fb185c753c07da3527756a8ed9a0733f'),
	(7,'alice','2018-03-31 14:18:26','2018-03-31 14:18:26','c6a7c237','d48b5d8a3b75da0962929402821b18e78668c821a4d9a02e2258ba91ac5e6d55'),
	(8,'bob','2018-03-31 14:18:33','2018-03-31 14:18:33','b28c3828','493f9e04310f5040e06f115cf47ba5613b2260ef53c5d4de7ed1d1b313661293'),
	(9,'charlie','2018-04-14 10:47:32','2018-04-14 10:47:32','f208ecf9','c53aee8cf8acd7099896754f367654283eb432f832ff9374865bbd80db2255a5'),
	(10,'mallory','2018-04-14 11:02:23','2018-04-14 11:02:23','97ecfc51','c4384f3167559deb91d6513382d7d563f442707cbecae5445b17bb2128082da0'),
	(11,'test','2018-04-14 11:26:30','2018-04-14 11:26:30','3fee5235','1d949d349dfccf3f200ff61e682219c2a5bca6581821835829d9e904854f6b44');

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
