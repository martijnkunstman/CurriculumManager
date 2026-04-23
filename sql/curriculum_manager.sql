-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 20, 2026 at 10:28 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `curriculum_manager`
--
DROP TABLE IF EXISTS `cohort_leereenheid_planning`;
DROP TABLE IF EXISTS `cohort_schooljaren`;
DROP TABLE IF EXISTS `cohorten`;
DROP TABLE IF EXISTS `leereenheden`;
DROP TABLE IF EXISTS `leereenheid_types`;
DROP TABLE IF EXISTS `ka_weken`;
DROP TABLE IF EXISTS `ka_periodes`;
DROP TABLE IF EXISTS `ka_schooljaren`;
DROP TABLE IF EXISTS `ka_week_types`;
DROP TABLE IF EXISTS `kd_werkproces_competenties`;
DROP TABLE IF EXISTS `kd_competenties`;
DROP TABLE IF EXISTS `kd_gedrag`;
DROP TABLE IF EXISTS `kd_kerntaken`;
DROP TABLE IF EXISTS `kd_werkprocessen`;
DROP TABLE IF EXISTS `opleidingen`;
DROP TABLE IF EXISTS `kds`;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------

--
-- Table structure for table `ka_periodes`
--

CREATE TABLE `ka_periodes` (
  `id` int(11) NOT NULL,
  `schooljaar_id` int(11) NOT NULL,
  `volgnummer` int(11) NOT NULL,
  `naam` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ka_periodes`
--

INSERT INTO `ka_periodes` (`id`, `schooljaar_id`, `volgnummer`, `naam`) VALUES
(1, 1, 1, 'Periode 1'),
(2, 1, 2, 'Periode 2'),
(3, 1, 3, 'Periode 3'),
(4, 1, 4, 'Periode 4'),
(5, 2, 1, 'Periode 1'),
(6, 2, 2, 'Periode 2'),
(7, 2, 3, 'Periode 3'),
(8, 2, 4, 'Periode 4'),
(9, 3, 1, 'Periode 1'),
(10, 3, 2, 'Periode 2'),
(11, 3, 3, 'Periode 3'),
(12, 3, 4, 'Periode 4'),
(13, 4, 1, 'Periode 1'),
(14, 4, 2, 'Periode 2'),
(15, 4, 3, 'Periode 3'),
(16, 4, 4, 'Periode 4'),
(17, 5, 1, 'Periode 1'),
(18, 5, 2, 'Periode 2'),
(19, 5, 3, 'Periode 3'),
(20, 5, 4, 'Periode 4'),
(21, 6, 1, 'Periode 1'),
(22, 6, 2, 'Periode 2'),
(23, 6, 3, 'Periode 3'),
(24, 6, 4, 'Periode 4'),
(25, 7, 1, 'Periode 1'),
(26, 7, 2, 'Periode 2'),
(27, 7, 3, 'Periode 3'),
(28, 7, 4, 'Periode 4');

-- --------------------------------------------------------

--
-- Table structure for table `ka_schooljaren`
--

CREATE TABLE `ka_schooljaren` (
  `id` int(11) NOT NULL,
  `naam` varchar(50) NOT NULL,
  `startdatum` date NOT NULL,
  `einddatum` date NOT NULL
) ;

--
-- Dumping data for table `ka_schooljaren`
--

INSERT INTO `ka_schooljaren` (`id`, `naam`, `startdatum`, `einddatum`) VALUES
(1, '2022-2023', '2022-08-01', '2023-07-31'),
(2, '2023-2024', '2023-08-01', '2024-07-31'),
(3, '2024-2025', '2024-08-01', '2025-07-31'),
(4, '2025-2026', '2025-08-01', '2026-07-31'),
(5, '2026-2027', '2026-08-01', '2027-07-31'),
(6, '2027-2028', '2027-08-01', '2028-07-31'),
(7, '2028-2029', '2028-08-01', '2029-07-31');

-- --------------------------------------------------------

--
-- Table structure for table `ka_week_types`
--

CREATE TABLE `ka_week_types` (
  `id` int(11) NOT NULL,
  `is_lesweek` tinyint(1) NOT NULL DEFAULT 0,
  `omschrijving` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ka_week_types`
--

INSERT INTO `ka_week_types` (`id`, `is_lesweek`, `omschrijving`) VALUES
(1, 1, 'Lesweek'),
(2, 0, 'Zomervakantie'),
(3, 0, 'Herfstvakantie'),
(4, 0, 'Kerstvakantie'),
(5, 0, 'Voorjaarsvakantie'),
(6, 0, 'Meivakantie'),
(7, 1, 'Lesweek -1'),
(8, 1, 'Lesweek -2');

-- --------------------------------------------------------

--
-- Table structure for table `ka_weken`
--

CREATE TABLE `ka_weken` (
  `id` int(11) NOT NULL,
  `schooljaar_id` int(11) NOT NULL,
  `periode_id` int(11) DEFAULT NULL,
  `volgnummer_schooljaar` int(11) NOT NULL,
  `kalenderweek` int(11) NOT NULL,
  `startdatum` date NOT NULL,
  `einddatum` date NOT NULL,
  `type_id` int(11) NOT NULL
) ;

--
-- Dumping data for table `ka_weken`
--

INSERT INTO `ka_weken` (`id`, `schooljaar_id`, `periode_id`, `volgnummer_schooljaar`, `kalenderweek`, `startdatum`, `einddatum`, `type_id`) VALUES
(1, 1, NULL, 1, 31, '2022-08-01', '2022-08-07', 2),
(2, 1, NULL, 2, 32, '2022-08-08', '2022-08-14', 2),
(3, 1, NULL, 3, 33, '2022-08-15', '2022-08-21', 2),
(4, 1, 1, 4, 34, '2022-08-22', '2022-08-28', 1),
(5, 1, 1, 5, 35, '2022-08-29', '2022-09-04', 1),
(6, 1, 1, 6, 36, '2022-09-05', '2022-09-11', 1),
(7, 1, 1, 7, 37, '2022-09-12', '2022-09-18', 1),
(8, 1, 1, 8, 38, '2022-09-19', '2022-09-25', 1),
(9, 1, 1, 9, 39, '2022-09-26', '2022-10-02', 1),
(10, 1, 1, 10, 40, '2022-10-03', '2022-10-09', 1),
(11, 1, 1, 11, 41, '2022-10-10', '2022-10-16', 1),
(12, 1, 1, 12, 42, '2022-10-17', '2022-10-23', 1),
(13, 1, NULL, 13, 43, '2022-10-24', '2022-10-30', 3),
(14, 1, 1, 14, 44, '2022-10-31', '2022-11-06', 1),
(15, 1, 2, 15, 45, '2022-11-07', '2022-11-13', 1),
(16, 1, 2, 16, 46, '2022-11-14', '2022-11-20', 1),
(17, 1, 2, 17, 47, '2022-11-21', '2022-11-27', 1),
(18, 1, 2, 18, 48, '2022-11-28', '2022-12-04', 1),
(19, 1, 2, 19, 49, '2022-12-05', '2022-12-11', 1),
(20, 1, 2, 20, 50, '2022-12-12', '2022-12-18', 1),
(21, 1, 2, 21, 51, '2022-12-19', '2022-12-25', 1),
(22, 1, NULL, 22, 52, '2022-12-26', '2023-01-01', 4),
(23, 1, NULL, 23, 1, '2023-01-02', '2023-01-08', 4),
(24, 1, 2, 24, 2, '2023-01-09', '2023-01-15', 1),
(25, 1, 2, 25, 3, '2023-01-16', '2023-01-22', 1),
(26, 1, 2, 26, 4, '2023-01-23', '2023-01-29', 1),
(27, 1, 3, 27, 5, '2023-01-30', '2023-02-05', 1),
(28, 1, 3, 28, 6, '2023-02-06', '2023-02-12', 1),
(29, 1, 3, 29, 7, '2023-02-13', '2023-02-19', 1),
(30, 1, 3, 30, 8, '2023-02-20', '2023-02-26', 1),
(31, 1, NULL, 31, 9, '2023-02-27', '2023-03-05', 5),
(32, 1, 3, 32, 10, '2023-03-06', '2023-03-12', 1),
(33, 1, 3, 33, 11, '2023-03-13', '2023-03-19', 1),
(34, 1, 3, 34, 12, '2023-03-20', '2023-03-26', 1),
(35, 1, 3, 35, 13, '2023-03-27', '2023-04-02', 1),
(36, 1, 3, 36, 14, '2023-04-03', '2023-04-09', 1),
(37, 1, 3, 37, 15, '2023-04-10', '2023-04-16', 1),
(38, 1, 4, 38, 16, '2023-04-17', '2023-04-23', 1),
(39, 1, 4, 39, 17, '2023-04-24', '2023-04-30', 1),
(40, 1, NULL, 40, 18, '2023-05-01', '2023-05-07', 6),
(41, 1, 4, 41, 19, '2023-05-08', '2023-05-14', 1),
(42, 1, 4, 42, 20, '2023-05-15', '2023-05-21', 1),
(43, 1, 4, 43, 21, '2023-05-22', '2023-05-28', 1),
(44, 1, 4, 44, 22, '2023-05-29', '2023-06-04', 1),
(45, 1, 4, 45, 23, '2023-06-05', '2023-06-11', 1),
(46, 1, 4, 46, 24, '2023-06-12', '2023-06-18', 1),
(47, 1, 4, 47, 25, '2023-06-19', '2023-06-25', 1),
(48, 1, 4, 48, 26, '2023-06-26', '2023-07-02', 1),
(49, 1, NULL, 49, 27, '2023-07-03', '2023-07-09', 2),
(50, 1, NULL, 50, 28, '2023-07-10', '2023-07-16', 2),
(51, 1, NULL, 51, 29, '2023-07-17', '2023-07-23', 2),
(52, 1, NULL, 52, 30, '2023-07-24', '2023-07-30', 2),
(53, 2, NULL, 1, 31, '2023-07-31', '2023-08-06', 2),
(54, 2, NULL, 2, 32, '2023-08-07', '2023-08-13', 2),
(55, 2, NULL, 3, 33, '2023-08-14', '2023-08-20', 2),
(56, 2, 5, 4, 34, '2023-08-21', '2023-08-27', 1),
(57, 2, 5, 5, 35, '2023-08-28', '2023-09-03', 1),
(58, 2, 5, 6, 36, '2023-09-04', '2023-09-10', 1),
(59, 2, 5, 7, 37, '2023-09-11', '2023-09-17', 1),
(60, 2, 5, 8, 38, '2023-09-18', '2023-09-24', 1),
(61, 2, 5, 9, 39, '2023-09-25', '2023-10-01', 1),
(62, 2, 5, 10, 40, '2023-10-02', '2023-10-08', 1),
(63, 2, 5, 11, 41, '2023-10-09', '2023-10-15', 1),
(64, 2, NULL, 12, 42, '2023-10-16', '2023-10-22', 3),
(65, 2, 5, 13, 43, '2023-10-23', '2023-10-29', 1),
(66, 2, 5, 14, 44, '2023-10-30', '2023-11-05', 1),
(67, 2, 6, 15, 45, '2023-11-06', '2023-11-12', 1),
(68, 2, 6, 16, 46, '2023-11-13', '2023-11-19', 1),
(69, 2, 6, 17, 47, '2023-11-20', '2023-11-26', 1),
(70, 2, 6, 18, 48, '2023-11-27', '2023-12-03', 1),
(71, 2, 6, 19, 49, '2023-12-04', '2023-12-10', 1),
(72, 2, 6, 20, 50, '2023-12-11', '2023-12-17', 1),
(73, 2, 6, 21, 51, '2023-12-18', '2023-12-24', 1),
(74, 2, NULL, 22, 52, '2023-12-25', '2023-12-31', 4),
(75, 2, NULL, 23, 1, '2024-01-01', '2024-01-07', 4),
(76, 2, 6, 24, 2, '2024-01-08', '2024-01-14', 1),
(77, 2, 6, 25, 3, '2024-01-15', '2024-01-21', 1),
(78, 2, 6, 26, 4, '2024-01-22', '2024-01-28', 1),
(79, 2, 7, 27, 5, '2024-01-29', '2024-02-04', 1),
(80, 2, 7, 28, 6, '2024-02-05', '2024-02-11', 1),
(81, 2, 7, 29, 7, '2024-02-12', '2024-02-18', 1),
(82, 2, NULL, 30, 8, '2024-02-19', '2024-02-25', 5),
(83, 2, 7, 31, 9, '2024-02-26', '2024-03-03', 1),
(84, 2, 7, 32, 10, '2024-03-04', '2024-03-10', 1),
(85, 2, 7, 33, 11, '2024-03-11', '2024-03-17', 1),
(86, 2, 7, 34, 12, '2024-03-18', '2024-03-24', 1),
(87, 2, 7, 35, 13, '2024-03-25', '2024-03-31', 1),
(88, 2, 7, 36, 14, '2024-04-01', '2024-04-07', 1),
(89, 2, 7, 37, 15, '2024-04-08', '2024-04-14', 1),
(90, 2, 8, 38, 16, '2024-04-15', '2024-04-21', 1),
(91, 2, 8, 39, 17, '2024-04-22', '2024-04-28', 1),
(92, 2, NULL, 40, 18, '2024-04-29', '2024-05-05', 6),
(93, 2, NULL, 41, 19, '2024-05-06', '2024-05-12', 6),
(94, 2, 8, 42, 20, '2024-05-13', '2024-05-19', 1),
(95, 2, 8, 43, 21, '2024-05-20', '2024-05-26', 1),
(96, 2, 8, 44, 22, '2024-05-27', '2024-06-02', 1),
(97, 2, 8, 45, 23, '2024-06-03', '2024-06-09', 1),
(98, 2, 8, 46, 24, '2024-06-10', '2024-06-16', 1),
(99, 2, 8, 47, 25, '2024-06-17', '2024-06-23', 1),
(100, 2, 8, 48, 26, '2024-06-24', '2024-06-30', 1),
(101, 2, 8, 49, 27, '2024-07-01', '2024-07-07', 1),
(102, 2, 8, 50, 28, '2024-07-08', '2024-07-14', 1),
(103, 2, NULL, 51, 29, '2024-07-15', '2024-07-21', 2),
(104, 2, NULL, 52, 30, '2024-07-22', '2024-07-28', 2),
(105, 3, NULL, 1, 31, '2024-07-29', '2024-08-04', 2),
(106, 3, NULL, 2, 32, '2024-08-05', '2024-08-11', 2),
(107, 3, NULL, 3, 33, '2024-08-12', '2024-08-18', 2),
(108, 3, NULL, 4, 34, '2024-08-19', '2024-08-25', 2),
(109, 3, 9, 5, 35, '2024-08-26', '2024-09-01', 1),
(110, 3, 9, 6, 36, '2024-09-02', '2024-09-08', 1),
(111, 3, 9, 7, 37, '2024-09-09', '2024-09-15', 1),
(112, 3, 9, 8, 38, '2024-09-16', '2024-09-22', 1),
(113, 3, 9, 9, 39, '2024-09-23', '2024-09-29', 1),
(114, 3, 9, 10, 40, '2024-09-30', '2024-10-06', 1),
(115, 3, 9, 11, 41, '2024-10-07', '2024-10-13', 1),
(116, 3, 9, 12, 42, '2024-10-14', '2024-10-20', 1),
(117, 3, 9, 13, 43, '2024-10-21', '2024-10-27', 1),
(118, 3, NULL, 14, 44, '2024-10-28', '2024-11-03', 3),
(119, 3, 10, 15, 45, '2024-11-04', '2024-11-10', 1),
(120, 3, 10, 16, 46, '2024-11-11', '2024-11-17', 1),
(121, 3, 10, 17, 47, '2024-11-18', '2024-11-24', 1),
(122, 3, 10, 18, 48, '2024-11-25', '2024-12-01', 1),
(123, 3, 10, 19, 49, '2024-12-02', '2024-12-08', 1),
(124, 3, 10, 20, 50, '2024-12-09', '2024-12-15', 1),
(125, 3, 10, 21, 51, '2024-12-16', '2024-12-22', 1),
(126, 3, NULL, 22, 52, '2024-12-23', '2024-12-29', 4),
(127, 3, NULL, 23, 1, '2024-12-30', '2025-01-05', 4),
(128, 3, 10, 24, 2, '2025-01-06', '2025-01-12', 1),
(129, 3, 10, 25, 3, '2025-01-13', '2025-01-19', 1),
(130, 3, 10, 26, 4, '2025-01-20', '2025-01-26', 1),
(131, 3, 11, 27, 5, '2025-01-27', '2025-02-02', 1),
(132, 3, 11, 28, 6, '2025-02-03', '2025-02-09', 1),
(133, 3, 11, 29, 7, '2025-02-10', '2025-02-16', 1),
(134, 3, 11, 30, 8, '2025-02-17', '2025-02-23', 1),
(135, 3, NULL, 31, 9, '2025-02-24', '2025-03-02', 5),
(136, 3, 11, 32, 10, '2025-03-03', '2025-03-09', 1),
(137, 3, 11, 33, 11, '2025-03-10', '2025-03-16', 1),
(138, 3, 11, 34, 12, '2025-03-17', '2025-03-23', 1),
(139, 3, 11, 35, 13, '2025-03-24', '2025-03-30', 1),
(140, 3, 11, 36, 14, '2025-03-31', '2025-04-06', 1),
(141, 3, 11, 37, 15, '2025-04-07', '2025-04-13', 1),
(142, 3, 12, 38, 16, '2025-04-14', '2025-04-20', 1),
(143, 3, NULL, 39, 17, '2025-04-21', '2025-04-27', 6),
(144, 3, NULL, 40, 18, '2025-04-28', '2025-05-04', 6),
(145, 3, 12, 41, 19, '2025-05-05', '2025-05-11', 1),
(146, 3, 12, 42, 20, '2025-05-12', '2025-05-18', 1),
(147, 3, 12, 43, 21, '2025-05-19', '2025-05-25', 1),
(148, 3, 12, 44, 22, '2025-05-26', '2025-06-01', 1),
(149, 3, 12, 45, 23, '2025-06-02', '2025-06-08', 1),
(150, 3, 12, 46, 24, '2025-06-09', '2025-06-15', 1),
(151, 3, 12, 47, 25, '2025-06-16', '2025-06-22', 1),
(152, 3, 12, 48, 26, '2025-06-23', '2025-06-29', 1),
(153, 3, 12, 49, 27, '2025-06-30', '2025-07-06', 1),
(154, 3, 12, 50, 28, '2025-07-07', '2025-07-13', 1),
(155, 3, NULL, 51, 29, '2025-07-14', '2025-07-20', 2),
(156, 3, NULL, 52, 30, '2025-07-21', '2025-07-27', 2),
(157, 4, NULL, 1, 31, '2025-07-28', '2025-08-03', 2),
(158, 4, NULL, 2, 32, '2025-08-04', '2025-08-10', 2),
(159, 4, NULL, 3, 33, '2025-08-11', '2025-08-17', 2),
(160, 4, 13, 4, 34, '2025-08-18', '2025-08-24', 1),
(161, 4, 13, 5, 35, '2025-08-25', '2025-08-31', 1),
(162, 4, 13, 6, 36, '2025-09-01', '2025-09-07', 1),
(163, 4, 13, 7, 37, '2025-09-08', '2025-09-14', 1),
(164, 4, 13, 8, 38, '2025-09-15', '2025-09-21', 1),
(165, 4, 13, 9, 39, '2025-09-22', '2025-09-28', 1),
(166, 4, 13, 10, 40, '2025-09-29', '2025-10-05', 1),
(167, 4, 13, 11, 41, '2025-10-06', '2025-10-12', 1),
(168, 4, 13, 12, 42, '2025-10-13', '2025-10-19', 1),
(169, 4, NULL, 13, 43, '2025-10-20', '2025-10-26', 3),
(170, 4, 13, 14, 44, '2025-10-27', '2025-11-02', 1),
(171, 4, 14, 15, 45, '2025-11-03', '2025-11-09', 1),
(172, 4, 14, 16, 46, '2025-11-10', '2025-11-16', 1),
(173, 4, 14, 17, 47, '2025-11-17', '2025-11-23', 1),
(174, 4, 14, 18, 48, '2025-11-24', '2025-11-30', 1),
(175, 4, 14, 19, 49, '2025-12-01', '2025-12-07', 1),
(176, 4, 14, 20, 50, '2025-12-08', '2025-12-14', 1),
(177, 4, 14, 21, 51, '2025-12-15', '2025-12-21', 1),
(178, 4, NULL, 22, 52, '2025-12-22', '2025-12-28', 4),
(179, 4, NULL, 23, 1, '2025-12-29', '2026-01-04', 4),
(180, 4, 14, 24, 2, '2026-01-05', '2026-01-11', 1),
(181, 4, 14, 25, 3, '2026-01-12', '2026-01-18', 1),
(182, 4, 14, 26, 4, '2026-01-19', '2026-01-25', 1),
(183, 4, 15, 27, 5, '2026-01-26', '2026-02-01', 1),
(184, 4, 15, 28, 6, '2026-02-02', '2026-02-08', 1),
(185, 4, 15, 29, 7, '2026-02-09', '2026-02-15', 1),
(186, 4, NULL, 30, 8, '2026-02-16', '2026-02-22', 5),
(187, 4, 15, 31, 9, '2026-02-23', '2026-03-01', 1),
(188, 4, 15, 32, 10, '2026-03-02', '2026-03-08', 1),
(189, 4, 15, 33, 11, '2026-03-09', '2026-03-15', 1),
(190, 4, 15, 34, 12, '2026-03-16', '2026-03-22', 1),
(191, 4, 15, 35, 13, '2026-03-23', '2026-03-29', 1),
(192, 4, 15, 36, 14, '2026-03-30', '2026-04-05', 1),
(193, 4, 15, 37, 15, '2026-04-06', '2026-04-12', 1),
(194, 4, 16, 38, 16, '2026-04-13', '2026-04-19', 1),
(195, 4, 16, 39, 17, '2026-04-20', '2026-04-26', 1),
(196, 4, NULL, 40, 18, '2026-04-27', '2026-05-03', 6),
(197, 4, NULL, 41, 19, '2026-05-04', '2026-05-10', 6),
(198, 4, 16, 42, 20, '2026-05-11', '2026-05-17', 1),
(199, 4, 16, 43, 21, '2026-05-18', '2026-05-24', 1),
(200, 4, 16, 44, 22, '2026-05-25', '2026-05-31', 1),
(201, 4, 16, 45, 23, '2026-06-01', '2026-06-07', 1),
(202, 4, 16, 46, 24, '2026-06-08', '2026-06-14', 1),
(203, 4, 16, 47, 25, '2026-06-15', '2026-06-21', 1),
(204, 4, 16, 48, 26, '2026-06-22', '2026-06-28', 1),
(205, 4, 16, 49, 27, '2026-06-29', '2026-07-05', 1),
(206, 4, 16, 50, 28, '2026-07-06', '2026-07-12', 1),
(207, 4, NULL, 51, 29, '2026-07-13', '2026-07-19', 2),
(208, 4, NULL, 52, 30, '2026-07-20', '2026-07-26', 2),
(209, 5, NULL, 1, 31, '2026-07-27', '2026-08-02', 2),
(210, 5, NULL, 2, 32, '2026-08-03', '2026-08-09', 2),
(211, 5, NULL, 3, 33, '2026-08-10', '2026-08-16', 2),
(212, 5, 17, 4, 34, '2026-08-17', '2026-08-23', 1),
(213, 5, 17, 5, 35, '2026-08-24', '2026-08-30', 1),
(214, 5, 17, 6, 36, '2026-08-31', '2026-09-06', 1),
(215, 5, 17, 7, 37, '2026-09-07', '2026-09-13', 1),
(216, 5, 17, 8, 38, '2026-09-14', '2026-09-20', 1),
(217, 5, 17, 9, 39, '2026-09-21', '2026-09-27', 1),
(218, 5, 17, 10, 40, '2026-09-28', '2026-10-04', 1),
(219, 5, 17, 11, 41, '2026-10-05', '2026-10-11', 1),
(220, 5, 17, 12, 42, '2026-10-12', '2026-10-18', 1),
(221, 5, NULL, 13, 43, '2026-10-19', '2026-10-25', 3),
(222, 5, 17, 14, 44, '2026-10-26', '2026-11-01', 1),
(223, 5, 18, 15, 45, '2026-11-02', '2026-11-08', 1),
(224, 5, 18, 16, 46, '2026-11-09', '2026-11-15', 1),
(225, 5, 18, 17, 47, '2026-11-16', '2026-11-22', 1),
(226, 5, 18, 18, 48, '2026-11-23', '2026-11-29', 1),
(227, 5, 18, 19, 49, '2026-11-30', '2026-12-06', 1),
(228, 5, 18, 20, 50, '2026-12-07', '2026-12-13', 1),
(229, 5, 18, 21, 51, '2026-12-14', '2026-12-20', 1),
(230, 5, NULL, 22, 52, '2026-12-21', '2026-12-27', 4),
(231, 5, NULL, 23, 53, '2026-12-28', '2027-01-03', 4),
(232, 5, 18, 24, 1, '2027-01-04', '2027-01-10', 1),
(233, 5, 18, 25, 2, '2027-01-11', '2027-01-17', 1),
(234, 5, 18, 26, 3, '2027-01-18', '2027-01-24', 1),
(235, 5, 18, 27, 4, '2027-01-25', '2027-01-31', 1),
(236, 5, 19, 28, 5, '2027-02-01', '2027-02-07', 1),
(237, 5, 19, 29, 6, '2027-02-08', '2027-02-14', 1),
(238, 5, NULL, 30, 7, '2027-02-15', '2027-02-21', 5),
(239, 5, 19, 31, 8, '2027-02-22', '2027-02-28', 1),
(240, 5, 19, 32, 9, '2027-03-01', '2027-03-07', 1),
(241, 5, 19, 33, 10, '2027-03-08', '2027-03-14', 1),
(242, 5, 19, 34, 11, '2027-03-15', '2027-03-21', 1),
(243, 5, 19, 35, 12, '2027-03-22', '2027-03-28', 1),
(244, 5, 19, 36, 13, '2027-03-29', '2027-04-04', 1),
(245, 5, 19, 37, 14, '2027-04-05', '2027-04-11', 1),
(246, 5, 19, 38, 15, '2027-04-12', '2027-04-18', 1),
(247, 5, 20, 39, 16, '2027-04-19', '2027-04-25', 1),
(248, 5, NULL, 40, 17, '2027-04-26', '2027-05-02', 6),
(249, 5, NULL, 41, 18, '2027-05-03', '2027-05-09', 6),
(250, 5, 20, 42, 19, '2027-05-10', '2027-05-16', 1),
(251, 5, 20, 43, 20, '2027-05-17', '2027-05-23', 1),
(252, 5, 20, 44, 21, '2027-05-24', '2027-05-30', 1),
(253, 5, 20, 45, 22, '2027-05-31', '2027-06-06', 1),
(254, 5, 20, 46, 23, '2027-06-07', '2027-06-13', 1),
(255, 5, 20, 47, 24, '2027-06-14', '2027-06-20', 1),
(256, 5, 20, 48, 25, '2027-06-21', '2027-06-27', 1),
(257, 5, 20, 49, 26, '2027-06-28', '2027-07-04', 1),
(258, 5, 20, 50, 27, '2027-07-05', '2027-07-11', 1),
(259, 5, 20, 51, 28, '2027-07-12', '2027-07-18', 1),
(260, 5, NULL, 52, 29, '2027-07-19', '2027-07-25', 2),
(261, 6, NULL, 1, 31, '2027-08-02', '2027-08-08', 2),
(262, 6, NULL, 2, 32, '2027-08-09', '2027-08-15', 2),
(263, 6, NULL, 3, 33, '2027-08-16', '2027-08-22', 2),
(264, 6, 21, 4, 34, '2027-08-23', '2027-08-29', 1),
(265, 6, 21, 5, 35, '2027-08-30', '2027-09-05', 1),
(266, 6, 21, 6, 36, '2027-09-06', '2027-09-12', 1),
(267, 6, 21, 7, 37, '2027-09-13', '2027-09-19', 1),
(268, 6, 21, 8, 38, '2027-09-20', '2027-09-26', 1),
(269, 6, 21, 9, 39, '2027-09-27', '2027-10-03', 1),
(270, 6, 21, 10, 40, '2027-10-04', '2027-10-10', 1),
(271, 6, 21, 11, 41, '2027-10-11', '2027-10-17', 1),
(272, 6, 21, 12, 42, '2027-10-18', '2027-10-24', 1),
(273, 6, NULL, 13, 43, '2027-10-25', '2027-10-31', 3),
(274, 6, 21, 14, 44, '2027-11-01', '2027-11-07', 1),
(275, 6, 22, 15, 45, '2027-11-08', '2027-11-14', 1),
(276, 6, 22, 16, 46, '2027-11-15', '2027-11-21', 1),
(277, 6, 22, 17, 47, '2027-11-22', '2027-11-28', 1),
(278, 6, 22, 18, 48, '2027-11-29', '2027-12-05', 1),
(279, 6, 22, 19, 49, '2027-12-06', '2027-12-12', 1),
(280, 6, 22, 20, 50, '2027-12-13', '2027-12-19', 1),
(281, 6, 22, 21, 51, '2027-12-20', '2027-12-26', 1),
(282, 6, NULL, 22, 52, '2027-12-27', '2028-01-02', 4),
(283, 6, NULL, 23, 1, '2028-01-03', '2028-01-09', 4),
(284, 6, 22, 24, 2, '2028-01-10', '2028-01-16', 1),
(285, 6, 22, 25, 3, '2028-01-17', '2028-01-23', 1),
(286, 6, 22, 26, 4, '2028-01-24', '2028-01-30', 1),
(287, 6, 23, 27, 5, '2028-01-31', '2028-02-06', 1),
(288, 6, 23, 28, 6, '2028-02-07', '2028-02-13', 1),
(289, 6, 23, 29, 7, '2028-02-14', '2028-02-20', 1),
(290, 6, 23, 30, 8, '2028-02-21', '2028-02-27', 1),
(291, 6, NULL, 31, 9, '2028-02-28', '2028-03-05', 5),
(292, 6, 23, 32, 10, '2028-03-06', '2028-03-12', 1),
(293, 6, 23, 33, 11, '2028-03-13', '2028-03-19', 1),
(294, 6, 23, 34, 12, '2028-03-20', '2028-03-26', 1),
(295, 6, 23, 35, 13, '2028-03-27', '2028-04-02', 1),
(296, 6, 23, 36, 14, '2028-04-03', '2028-04-09', 1),
(297, 6, 23, 37, 15, '2028-04-10', '2028-04-16', 1),
(298, 6, 24, 38, 16, '2028-04-17', '2028-04-23', 1),
(299, 6, NULL, 39, 17, '2028-04-24', '2028-04-30', 6),
(300, 6, NULL, 40, 18, '2028-05-01', '2028-05-07', 6),
(301, 6, 24, 41, 19, '2028-05-08', '2028-05-14', 1),
(302, 6, 24, 42, 20, '2028-05-15', '2028-05-21', 1),
(303, 6, 24, 43, 21, '2028-05-22', '2028-05-28', 1),
(304, 6, 24, 44, 22, '2028-05-29', '2028-06-04', 1),
(305, 6, 24, 45, 23, '2028-06-05', '2028-06-11', 1),
(306, 6, 24, 46, 24, '2028-06-12', '2028-06-18', 1),
(307, 6, 24, 47, 25, '2028-06-19', '2028-06-25', 1),
(308, 6, 24, 48, 26, '2028-06-26', '2028-07-02', 1),
(309, 6, 24, 49, 27, '2028-07-03', '2028-07-09', 1),
(310, 6, 24, 50, 28, '2028-07-10', '2028-07-16', 1),
(311, 6, NULL, 51, 29, '2027-07-17', '2027-07-23', 2),
(312, 6, NULL, 52, 30, '2027-07-24', '2027-07-30', 2),
(313, 7, NULL, 1, 31, '2028-07-31', '2028-08-06', 2),
(314, 7, NULL, 2, 32, '2028-08-07', '2028-08-13', 2),
(315, 7, NULL, 3, 33, '2028-08-14', '2028-08-20', 2),
(316, 7, 25, 4, 34, '2028-08-21', '2028-08-27', 1),
(317, 7, 25, 5, 35, '2028-08-28', '2028-09-03', 1),
(318, 7, 25, 6, 36, '2028-09-04', '2028-09-10', 1),
(319, 7, 25, 7, 37, '2028-09-11', '2028-09-17', 1),
(320, 7, 25, 8, 38, '2028-09-18', '2028-09-24', 1),
(321, 7, 25, 9, 39, '2028-09-25', '2028-10-01', 1),
(322, 7, 25, 10, 40, '2028-10-02', '2028-10-08', 1),
(323, 7, 25, 11, 41, '2028-10-09', '2028-10-15', 1),
(324, 7, 25, 12, 42, '2028-10-16', '2028-10-22', 1),
(325, 7, NULL, 13, 43, '2028-10-23', '2028-10-29', 3),
(326, 7, 25, 14, 44, '2028-10-30', '2028-11-05', 1),
(327, 7, 26, 15, 45, '2028-11-06', '2028-11-12', 1),
(328, 7, 26, 16, 46, '2028-11-13', '2028-11-19', 1),
(329, 7, 26, 17, 47, '2028-11-20', '2028-11-26', 1),
(330, 7, 26, 18, 48, '2028-11-27', '2028-12-03', 1),
(331, 7, 26, 19, 49, '2028-12-04', '2028-12-10', 1),
(332, 7, 26, 20, 50, '2028-12-11', '2028-12-17', 1),
(333, 7, 26, 21, 51, '2028-12-18', '2028-12-24', 1),
(334, 7, NULL, 22, 52, '2028-12-25', '2028-12-31', 4),
(335, 7, NULL, 23, 1, '2029-01-01', '2029-01-07', 4),
(336, 7, 26, 24, 2, '2029-01-08', '2029-01-14', 1),
(337, 7, 26, 25, 3, '2029-01-15', '2029-01-21', 1),
(338, 7, 26, 26, 4, '2029-01-22', '2029-01-28', 1),
(339, 7, 27, 27, 5, '2029-01-29', '2029-02-04', 1),
(340, 7, 27, 28, 6, '2029-02-05', '2029-02-11', 1),
(341, 7, 27, 29, 7, '2029-02-12', '2029-02-18', 1),
(342, 7, NULL, 30, 8, '2029-02-19', '2029-02-25', 5),
(343, 7, 27, 31, 9, '2029-02-26', '2029-03-04', 1),
(344, 7, 27, 32, 10, '2029-03-05', '2029-03-11', 1),
(345, 7, 27, 33, 11, '2029-03-12', '2029-03-18', 1),
(346, 7, 27, 34, 12, '2029-03-19', '2029-03-25', 1),
(347, 7, 27, 35, 13, '2029-03-26', '2029-04-01', 1),
(348, 7, 27, 36, 14, '2029-04-02', '2029-04-08', 1),
(349, 7, 27, 37, 15, '2029-04-09', '2029-04-15', 1),
(350, 7, 28, 38, 16, '2029-04-16', '2029-04-22', 1),
(351, 7, 28, 39, 17, '2029-04-23', '2029-04-29', 1),
(352, 7, NULL, 40, 18, '2029-04-30', '2029-05-06', 6),
(353, 7, NULL, 41, 19, '2029-05-07', '2029-05-13', 6),
(354, 7, 28, 42, 20, '2029-05-14', '2029-05-20', 1),
(355, 7, 28, 43, 21, '2029-05-21', '2029-05-27', 1),
(356, 7, 28, 44, 22, '2029-05-28', '2029-06-03', 1),
(357, 7, 28, 45, 23, '2029-06-04', '2029-06-10', 1),
(358, 7, 28, 46, 24, '2029-06-11', '2029-06-17', 1),
(359, 7, 28, 47, 25, '2029-06-18', '2029-06-24', 1),
(360, 7, 28, 48, 26, '2029-06-25', '2029-07-01', 1),
(361, 7, 28, 49, 27, '2029-07-02', '2029-07-08', 1),
(362, 7, 28, 50, 28, '2029-07-09', '2029-07-15', 1),
(363, 7, NULL, 51, 29, '2029-07-16', '2029-07-22', 2),
(364, 7, NULL, 52, 30, '2029-07-23', '2029-07-29', 2);

-- --------------------------------------------------------

--
-- Table structure for table `kds`
--

CREATE TABLE `kds` (
  `id` int(11) NOT NULL,
  `crebonr` int(11) NOT NULL,
  `titel` varchar(255) NOT NULL,
  `versie` varchar(50) DEFAULT NULL,
  `geldig_vanaf` date DEFAULT NULL,
  `mbo_niveau` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kds`
--

INSERT INTO `kds` (`id`, `crebonr`, `titel`, `versie`, `geldig_vanaf`, `mbo_niveau`) VALUES
(1, 25998, 'Software developer', '2024', '2024-08-01', 4);

-- --------------------------------------------------------

--
-- Table structure for table `kd_competenties`
--

CREATE TABLE `kd_competenties` (
  `id` int(11) NOT NULL,
  `naam` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kd_competenties`
--

INSERT INTO `kd_competenties` (`id`, `naam`) VALUES
(2, 'Analyseren'),
(10, 'Formuleren en rapporteren'),
(6, 'Instructies en procedures opvolgen'),
(8, 'Kwaliteit leveren'),
(11, 'Leren'),
(9, 'Met druk en tegenslag omgaan'),
(4, 'Onderzoeken'),
(7, 'Op de behoeften en verwachtingen van de \"klant\" richten'),
(3, 'Plannen en organiseren'),
(12, 'Presenteren'),
(1, 'Samenwerken en overleggen'),
(5, 'Vakdeskundigheid toepassen');

-- --------------------------------------------------------

--
-- Table structure for table `kd_gedrag`
--

CREATE TABLE `kd_gedrag` (
  `id` int(11) NOT NULL,
  `werkproces_id` int(11) DEFAULT NULL,
  `omschrijving` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kd_gedrag`
--

INSERT INTO `kd_gedrag` (`id`, `werkproces_id`, `omschrijving`) VALUES
(1, 1, 'stemt zorgvuldig doelen en planning af met opdrachtgever/leidinggevende/belanghebbenden en vraagt door totdat alles duidelijk is.'),
(2, 1, 'trekt logische conclusies uit de beschikbare informatie over de benodigde werkzaamheden en eventuele risico\'s.'),
(3, 1, 'stelt realistische doelen, prioriteiten en een realistisch tijdspad op voor de te realiseren software(onderdelen).'),
(4, 1, 'bewaakt nauwlettend de gestelde doelen en planning.'),
(5, 2, 'beargumenteert met steekhoudende argumenten de gemaakte keuzes in het ontwerp die past bij de praktijkrichting (zoals bijv. efficiëntie, structuur, design patterns, toegankelijkheid).'),
(6, 2, 'controleert of het ontwerp voldoet aan de gestelde eisen en wensen en doet indien nodig voorstellen om het ontwerp aan te passen.'),
(7, 2, 'volgt de geldende protocollen en regelgeving rondom privacy, toegankelijkheid, ethiek en veiligheid van de software nauwgezet op en laat dit in het ontwerp zien.'),
(8, 3, 'kiest de juiste materialen en middelen en gebruikt deze effectief.'),
(9, 3, 'hanteert de code conventies volgens de voorgeschreven wijze.'),
(10, 3, 'realiseert software die netjes en goed leesbaar is.'),
(11, 3, 'realiseert de software nauwgezet conform de eisen uit opdracht en ontwerp.'),
(12, 3, 'presteert onder (tijds)druk en/of in een stressvolle omgeving effectief en productief.'),
(13, 3, 'werkt in het geval van integratie van assets samen met andere betrokkenen en stemt met hen een heldere taakverdeling af.'),
(14, 3, 'beargumenteert met steekhoudende argumenten de gemaakte keuzes in de realisatie.'),
(15, 4, 'voert snel, correct en adequaat de testactiviteiten uit.'),
(16, 4, 'interpreteert de testresultaten en trekt logische conclusies.'),
(17, 4, 'legt testresultaten en conclusies nauwkeurig, duidelijk en conform bedrijfs- of beroepsstandaarden vast.'),
(18, 4, 'houdt rekening met de behoeften van de eindgebruikers tijdens het testen.'),
(19, 5, 'analyseert systematisch alle beschikbare informatiebronnen voor de aan te passen software.'),
(20, 5, 'toont technisch inzicht en abstractievermogen bij het interpreteren en vertalen van wensen, reacties, testresultaten...'),
(21, 5, 'stemt met opdrachtgever/leidinggevende/belanghebbenden duidelijk af welke werkzaamheden benodigd zijn, evenals een haalbare planning.'),
(22, 6, 'brengt actief noodzakelijke en relevante onderwerpen voor de samenwerkingsvorm in;'),
(23, 6, 'participeert actief en zelfkritisch in het overleg, door het melden van uitdagingen en knelpunten en/of vragen om advies;'),
(24, 6, 'geeft ruimte aan overige participanten, luistert naar hun input en reageert diplomatiek op die input;'),
(25, 6, 'geeft desgevraagd feedback gebruikmakend van de daarin geldende conventies;'),
(26, 6, 'ontvangt feedback en vraagt door bij onduidelijkheden;'),
(27, 6, 'vraagt naar het werk van anderen en wisselt informatie hierover uit;'),
(28, 6, 'gaat op tijd op zoek naar oplossingen in geval van geconstateerde tekorten in kennis of vaardigheden en formuleert afspraken eenduidig;'),
(29, 6, 'houdt zich aan de afspraken /procedures/werkwijze voor de samenwerking.'),
(30, 7, 'legt de opgeleverde functionaliteiten duidelijk uit en weet vragen over het opgeleverde product of de uitgevoerde werkzaamheden adequaat te beantwoorden.'),
(31, 7, 'houdt een goed opgebouwd en met argumenten onderbouwd verhaal en controleert of de boodschap is overgekomen.'),
(32, 7, 'maakt contact met de toehoorders en stemt de stijl van communiceren en eventuele presentatiemiddelen af op de doelgroep.'),
(33, 8, 'stelt zich open voor feedback en vraagt expliciet naar de mening en ideeën van anderen;'),
(34, 8, 'geeft positieve, constructieve feedback over het werk en/of de inbreng van anderen;'),
(35, 8, 'toont zich kritisch op het eigen werk;'),
(36, 8, 'formuleert concreet nieuwe kwaliteitsdoelen voor de eigen ontwikkeling en/of de samenwerking.');

-- --------------------------------------------------------

--
-- Table structure for table `kd_kerntaken`
--

CREATE TABLE `kd_kerntaken` (
  `id` int(11) NOT NULL,
  `kwalificatie_id` int(11) DEFAULT NULL,
  `code` varchar(50) NOT NULL,
  `titel` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kd_kerntaken`
--

INSERT INTO `kd_kerntaken` (`id`, `kwalificatie_id`, `code`, `titel`) VALUES
(1, 1, 'B1-K1', 'Realiseert software'),
(2, 1, 'B1-K2', 'Voert ICT-projecten uit');

-- --------------------------------------------------------

--
-- Table structure for table `kd_werkprocessen`
--

CREATE TABLE `kd_werkprocessen` (
  `id` int(11) NOT NULL,
  `kerntaak_id` int(11) DEFAULT NULL,
  `code` varchar(50) NOT NULL,
  `titel` varchar(255) NOT NULL,
  `omschrijving` text DEFAULT NULL,
  `verwacht_resultaat` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kd_werkprocessen`
--

INSERT INTO `kd_werkprocessen` (`id`, `kerntaak_id`, `code`, `titel`, `omschrijving`, `verwacht_resultaat`) VALUES
(1, 1, 'B1-K1-W1', 'Stemt opdracht af, plant werkzaamheden en bewaakt de voortgang', 'De beginnend beroepsbeoefenaar stemt af met de opdrachtgever/leidinggevende/belanghebbenden wat er ontwikkeld moet worden, welke doelen behaald moeten worden, en wanneer het klaar moet zijn. Tijdens het ontwikkelproces houdt de beginnend beroepsbeoefenaar bij wat is gedaan, welke taken nog uitgevoerd moeten worden en gaat na of de planning in gevaar komt.', 'Doelen en planning zijn afgestemd met de opdrachtgever/leidinggevende/belanghebbenden. De voortgang is bewaakt.'),
(2, 1, 'B1-K1-W2', 'Maakt een technisch ontwerp voor software', 'De beginnend beroepsbeoefenaar maakt een (deel) ontwerp dat aansluit op de geformuleerde eisen en wensen. Op basis van de informatie uit de opdracht en planning zet de beginnend beroepsbeoefenaar alternatieven voor het ontwerp naast elkaar en werkt het meest kansrijke alternatief uit.', 'Het (deel) ontwerp sluit aan op de geformuleerde eisen en wensen.'),
(3, 1, 'B1-K1-W3', 'Realiseert (onderdelen van) software', 'De beginnend beroepsbeoefenaar werkt aan het ontwikkelen van (onderdelen van) software voor het (deel) ontwerp. De beginnend beroepsbeoefenaar programmeert de software, schrijft de benodigde code en integreert waar nodig (aangeleverde) assets.', 'De software werkt en voldoet aan de opdracht, het ontwerp en de geldende code conventies.'),
(4, 1, 'B1-K1-W4', 'Test software', 'De beginnend beroepsbeoefenaar maakt testscenario\'s voor het testen van de gerealiseerde software. De beginnend beroepsbeoefenaar kiest een passende testvorm, zoals eigen test van software, unit tests, integratietest, acceptatietest en kiest een passende testmethodiek.', 'De testactiviteiten zijn correct uitgevoerd en er zijn plausibele conclusies getrokken.'),
(5, 1, 'B1-K1-W5', 'Doet verbetervoorstellen voor de software', 'De beginnend beroepsbeoefenaar interpreteert wensen, reacties, testresultaten en/of meldingen van opdrachtgever/leidinggevende/belanghebbenden voor het aanpassen van (onderdelen van) software. De beginnend beroepsbeoefenaar vertaalt dit in een voorstel voor verbetering van de software.', 'Voorstellen voor verbetering van de software zijn afgestemd met de opdrachtgever/leidinggevende/belanghebbenden.'),
(6, 2, 'B1-K2-W1', 'Werkt samen in een projectteam', 'De beginnend beroepsbeoefenaar werkt samen met de leidinggevende en/of het projectteam, collega\'s binnen de eigen organisatie en/of relevante belanghebbenden. De beginnend beroepsbeoefenaar informeert desgevraagd over de eigen werkzaamheden en resultaten.', 'De eigen werkzaamheden, resultaten en ideeën zijn gecommuniceerd, feedback is gevraagd en gegeven en afspraken zijn helder en worden nagekomen.'),
(7, 2, 'B1-K2-W2', 'Presenteert het opgeleverde werk', 'De beginnend beroepsbeoefenaar toont het opgeleverde (deel) product aan de opdrachtgever/leidinggevende/belanghebbenden, leidinggevende en/of het team. De beginnend beroepsbeoefenaar presenteert de functionaliteiten van het (deel) product en beantwoordt vragen.', 'Betrokkenen zijn goed geïnformeerd over het opgeleverde werk en de uitgevoerde werkzaamheden.'),
(8, 2, 'B1-K2-W3', 'Evalueert de samenwerking', 'De beginnend beroepsbeoefenaar draagt bij aan de evaluatie na oplevering van een (deel) product. Hierbij reflecteert die op de eigen prestaties, alsmede het teamproces en/of de werkwijze.', 'De eigen prestaties zijn geëvalueerd, alsmede het teamproces en/of de werkwijze.');

-- --------------------------------------------------------

--
-- Table structure for table `kd_werkproces_competenties`
--

CREATE TABLE `kd_werkproces_competenties` (
  `werkproces_id` int(11) NOT NULL,
  `competentie_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kd_werkproces_competenties`
--

INSERT INTO `kd_werkproces_competenties` (`werkproces_id`, `competentie_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(2, 5),
(2, 6),
(2, 7),
(3, 1),
(3, 5),
(3, 6),
(3, 8),
(3, 9),
(4, 2),
(4, 5),
(4, 6),
(4, 10),
(5, 1),
(5, 2),
(5, 3),
(5, 5),
(6, 1),
(6, 6),
(6, 10),
(6, 11),
(7, 5),
(7, 12),
(8, 1),
(8, 11);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ka_periodes`
--
ALTER TABLE `ka_periodes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `schooljaar_id` (`schooljaar_id`,`volgnummer`);

--
-- Indexes for table `ka_schooljaren`
--
ALTER TABLE `ka_schooljaren`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `naam` (`naam`);

--
-- Indexes for table `ka_week_types`
--
ALTER TABLE `ka_week_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `omschrijving` (`omschrijving`);

--
-- Indexes for table `ka_weken`
--
ALTER TABLE `ka_weken`
  ADD PRIMARY KEY (`id`),
  ADD KEY `schooljaar_id` (`schooljaar_id`),
  ADD KEY `periode_id` (`periode_id`),
  ADD KEY `type_id` (`type_id`),
  ADD KEY `idx_datum_range` (`startdatum`,`einddatum`);

--
-- Indexes for table `kds`
--
ALTER TABLE `kds`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kd_competenties`
--
ALTER TABLE `kd_competenties`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `naam` (`naam`);

--
-- Indexes for table `kd_gedrag`
--
ALTER TABLE `kd_gedrag`
  ADD PRIMARY KEY (`id`),
  ADD KEY `werkproces_id` (`werkproces_id`);

--
-- Indexes for table `kd_kerntaken`
--
ALTER TABLE `kd_kerntaken`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kwalificatie_id` (`kwalificatie_id`);

--
-- Indexes for table `kd_werkprocessen`
--
ALTER TABLE `kd_werkprocessen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kerntaak_id` (`kerntaak_id`);

--
-- Indexes for table `kd_werkproces_competenties`
--
ALTER TABLE `kd_werkproces_competenties`
  ADD PRIMARY KEY (`werkproces_id`,`competentie_id`),
  ADD KEY `competentie_id` (`competentie_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ka_periodes`
--
ALTER TABLE `ka_periodes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `ka_schooljaren`
--
ALTER TABLE `ka_schooljaren`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ka_week_types`
--
ALTER TABLE `ka_week_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `ka_weken`
--
ALTER TABLE `ka_weken`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kds`
--
ALTER TABLE `kds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `kd_competenties`
--
ALTER TABLE `kd_competenties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `kd_gedrag`
--
ALTER TABLE `kd_gedrag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `kd_kerntaken`
--
ALTER TABLE `kd_kerntaken`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `kd_werkprocessen`
--
ALTER TABLE `kd_werkprocessen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ka_periodes`
--
ALTER TABLE `ka_periodes`
  ADD CONSTRAINT `ka_periodes_ibfk_1` FOREIGN KEY (`schooljaar_id`) REFERENCES `ka_schooljaren` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ka_weken`
--
ALTER TABLE `ka_weken`
  ADD CONSTRAINT `ka_weken_ibfk_1` FOREIGN KEY (`schooljaar_id`) REFERENCES `ka_schooljaren` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ka_weken_ibfk_2` FOREIGN KEY (`periode_id`) REFERENCES `ka_periodes` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `ka_weken_ibfk_3` FOREIGN KEY (`type_id`) REFERENCES `ka_week_types` (`id`);

--
-- Constraints for table `kd_gedrag`
--
ALTER TABLE `kd_gedrag`
  ADD CONSTRAINT `kd_gedrag_ibfk_1` FOREIGN KEY (`werkproces_id`) REFERENCES `kd_werkprocessen` (`id`);

--
-- Constraints for table `kd_kerntaken`
--
ALTER TABLE `kd_kerntaken`
  ADD CONSTRAINT `kd_kerntaken_ibfk_1` FOREIGN KEY (`kwalificatie_id`) REFERENCES `kds` (`id`);

--
-- Constraints for table `kd_werkprocessen`
--
ALTER TABLE `kd_werkprocessen`
  ADD CONSTRAINT `kd_werkprocessen_ibfk_1` FOREIGN KEY (`kerntaak_id`) REFERENCES `kd_kerntaken` (`id`);

--
-- Constraints for table `kd_werkproces_competenties`
--
ALTER TABLE `kd_werkproces_competenties`
  ADD CONSTRAINT `kd_werkproces_competenties_ibfk_1` FOREIGN KEY (`werkproces_id`) REFERENCES `kd_werkprocessen` (`id`),
  ADD CONSTRAINT `kd_werkproces_competenties_ibfk_2` FOREIGN KEY (`competentie_id`) REFERENCES `kd_competenties` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- 1. Create the Cohorten table (Same as before)
CREATE TABLE `cohorten` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `naam` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2. Create the Leereenheid Types table (Same as before)
CREATE TABLE `leereenheid_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `naam` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 3. UPDATED: Create the Leereenheden table (Now independent and reusable)
-- Notice that cohort_id, start_week_id, and eind_week_id have been removed.
CREATE TABLE `leereenheden` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_id` int(11) NOT NULL,
  `naam` varchar(100) NOT NULL,
  `omschrijving` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`type_id`) REFERENCES `leereenheid_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4. NEW: Planning/Junction table to link Cohorten, Leereenheden, and Time
-- This table determines WHEN a specific cohort takes a specific leereenheid.
CREATE TABLE `cohort_leereenheid_planning` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cohort_id` int(11) NOT NULL,
  `leereenheid_id` int(11) NOT NULL,
  `start_week_id` int(11) NOT NULL,
  `eind_week_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`cohort_id`) REFERENCES `cohorten` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`leereenheid_id`) REFERENCES `leereenheden` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`start_week_id`) REFERENCES `ka_weken` (`id`),
  FOREIGN KEY (`eind_week_id`) REFERENCES `ka_weken` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `leereenheid_types` (`naam`) 
VALUES 
  ('module'),
  ('ontwikkelweek');

CREATE TABLE `cohort_schooljaren` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cohort_id` int(11) NOT NULL,
  `schooljaar_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`cohort_id`) REFERENCES `cohorten` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`schooljaar_id`) REFERENCES `ka_schooljaren` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;