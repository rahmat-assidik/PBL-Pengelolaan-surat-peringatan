-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 02, 2026 at 02:38 PM
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
-- Database: `suratperingatan`
--

-- --------------------------------------------------------

--
-- Table structure for table `mahasiswa`
--

CREATE TABLE `mahasiswa` (
  `id` int(11) NOT NULL,
  `nim` varchar(20) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `prodi` varchar(100) DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `wali_dosen` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mahasiswa`
--

INSERT INTO `mahasiswa` (`id`, `nim`, `nama`, `prodi`, `semester`, `wali_dosen`, `created_at`, `updated_at`) VALUES
(12, '3312501073', 'Rahmat Assidik', 'Teknik Informatika', 1, 'Nur Zahrati', '2025-12-20 10:03:44', '2025-12-20 10:03:44'),
(15, '3312501072', 'Darren Hafidz Najendra', 'Teknik Informatika', 1, 'Nur Zahrati', '2026-01-02 11:28:13', '2026-01-02 11:28:13'),
(16, '3312501074', 'Martini Angel Theresia', 'Teknik Informatika', 1, 'Nur Zahrati', '2026-01-02 11:45:18', '2026-01-02 11:45:18');

-- --------------------------------------------------------

--
-- Table structure for table `surat_peringatan`
--

CREATE TABLE `surat_peringatan` (
  `id` int(11) NOT NULL,
  `nim` varchar(20) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `ketua_prodi` varchar(100) DEFAULT NULL,
  `wali_dosen` varchar(100) DEFAULT NULL,
  `tingkatan_sp` enum('SP1','SP2','SP3') NOT NULL,
  `alasan_sp` text NOT NULL,
  `tanggal` date DEFAULT curdate(),
  `status` enum('Aktif','Tidak Aktif') DEFAULT 'Aktif',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `surat_peringatan`
--

INSERT INTO `surat_peringatan` (`id`, `nim`, `nama`, `ketua_prodi`, `wali_dosen`, `tingkatan_sp`, `alasan_sp`, `tanggal`, `status`, `created_at`, `updated_at`) VALUES
(39, '3312501074', 'Martini Angel Theresia', 'a', 'Nur Zahrati', 'SP1', 'a', '2026-01-02', 'Aktif', '2026-01-02 13:25:39', '2026-01-02 13:25:39'),
(40, '3312501074', 'Martini Angel Theresia', 'a', 'Nur Zahrati', 'SP3', 'a', '2026-01-02', 'Aktif', '2026-01-02 13:25:48', '2026-01-02 13:25:48');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'admin', '$2y$10$01EqJrOFKSORwkqpayPAUuN9cGedaHerNKQLDHCNlpbfL5DrbxVk.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nim` (`nim`),
  ADD KEY `idx_mahasiswa_nim` (`nim`);

--
-- Indexes for table `surat_peringatan`
--
ALTER TABLE `surat_peringatan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_nim_sp` (`nim`,`tingkatan_sp`),
  ADD KEY `idx_sp_nim` (`nim`),
  ADD KEY `idx_sp_tanggal` (`tanggal`),
  ADD KEY `idx_sp_status` (`status`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `surat_peringatan`
--
ALTER TABLE `surat_peringatan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `surat_peringatan`
--
ALTER TABLE `surat_peringatan`
  ADD CONSTRAINT `surat_peringatan_ibfk_1` FOREIGN KEY (`nim`) REFERENCES `mahasiswa` (`nim`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
