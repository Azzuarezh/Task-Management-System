-- phpMyAdmin SQL Dump
-- version 4.8.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 07, 2020 at 09:48 AM
-- Server version: 10.1.31-MariaDB
-- PHP Version: 7.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_task`
--
CREATE DATABASE IF NOT EXISTS `db_task` DEFAULT CHARACTER SET utf16 COLLATE utf16_bin;
USE `db_task`;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE IF NOT EXISTS `events` (
  `eventId` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf16_bin NOT NULL,
  `description` varchar(255) COLLATE utf16_bin DEFAULT NULL,
  `location` varchar(255) COLLATE utf16_bin DEFAULT NULL,
  `recurring` varchar(100) COLLATE utf16_bin DEFAULT NULL,
  `allDay` tinyint(1) NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime DEFAULT NULL,
  `reminderId` int(11) DEFAULT NULL,
  PRIMARY KEY (`eventId`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;


-- --------------------------------------------------------

--
-- Table structure for table `reminder`
--

DROP TABLE IF EXISTS `reminder`;
CREATE TABLE IF NOT EXISTS `reminder` (
  `reminderId` int(11) NOT NULL AUTO_INCREMENT,
  `timeToRemindDesc` varchar(255) COLLATE utf16_bin NOT NULL,
  `timeToRemindVal` int(11) NOT NULL,
  `timeToRemindUnit` varchar(30) COLLATE utf16_bin NOT NULL,
  PRIMARY KEY (`reminderId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

--
-- Dumping data for table `reminder`
--

INSERT INTO `reminder` (`reminderId`, `timeToRemindDesc`, `timeToRemindVal`, `timeToRemindUnit`) VALUES
(1, 'At the moment', 0, 'day'),
(2, '5 minutes before', 5, 'min'),
(3, '10 minutes before', 10, 'min'),
(4, '30 minutes before', 30, 'min'),
(5, '1 hour before', 1, 'hr'),
(6, '2 hours before', 2, 'hr'),
(7, '1 day before', 1, 'day'),
(8, '2 days before', 2, 'day'),
(9, '1 week before', 7, 'day');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf16_bin NOT NULL,
  `password` varchar(100) COLLATE utf16_bin NOT NULL,
  `firstName` varchar(100) COLLATE utf16_bin NOT NULL,
  `lastName` varchar(100) COLLATE utf16_bin NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `username`, `password`, `firstName`, `lastName`) VALUES
(1, 'john.doe', '123', 'John', 'Doe'),
(2, 'jane.doe', '123', 'Jane', 'Doe'),
(3, 'foo.bar', '2359', 'foobar', 'foobar');

-- --------------------------------------------------------

--
-- Table structure for table `user_events`
--

DROP TABLE IF EXISTS `user_events`;
CREATE TABLE IF NOT EXISTS `user_events` (
  `eventid` int(11) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_bin;



-- --------------------------------------------------------

--
-- Stand-in structure for view `view_user_events`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `view_user_events`;
CREATE TABLE IF NOT EXISTS `view_user_events` (
`userId` int(11)
,`firstName` varchar(100)
,`lastName` varchar(100)
,`eventId` int(11)
,`title` varchar(255)
,`description` varchar(255)
,`location` varchar(255)
,`recurring` varchar(100)
,`allDay` tinyint(1)
,`startDate` datetime
,`endDate` datetime
,`reminderId` int(11)
,`reminderDescription` varchar(255)
);

-- --------------------------------------------------------

--
-- Structure for view `view_user_events` exported as a table
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
