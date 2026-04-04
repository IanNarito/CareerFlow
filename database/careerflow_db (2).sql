-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 04, 2026 at 07:28 PM
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
-- Database: `careerflow_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `app_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `job_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `match_score` float DEFAULT NULL,
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `interview_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`app_id`, `user_id`, `job_id`, `status`, `match_score`, `applied_at`, `interview_date`) VALUES
(1, 3, 1, 'under review', 85, '2026-04-04 15:05:55', NULL),
(2, 3, 2, 'rejected', 85, '2026-04-04 17:01:02', NULL),
(3, 3, 2, 'hired', 85, '2026-04-04 17:06:58', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `interviews`
--

CREATE TABLE `interviews` (
  `interview_id` int(11) NOT NULL,
  `app_id` int(11) NOT NULL,
  `interview_date` datetime NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `status` enum('Scheduled','Completed','Cancelled') DEFAULT 'Scheduled',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interviews`
--

INSERT INTO `interviews` (`interview_id`, `app_id`, `interview_date`, `location`, `status`, `created_at`) VALUES
(1, 1, '2026-04-04 12:00:00', 'CareerFlow Office / Online', 'Scheduled', '2026-04-04 15:51:50'),
(4, 1, '2026-04-11 23:55:00', 'CareerFlow Office / Online', 'Cancelled', '2026-04-04 15:55:00'),
(5, 1, '2026-04-06 12:30:00', 'CareerFlow Office / Online', 'Scheduled', '2026-04-04 16:00:48'),
(6, 1, '2026-04-05 12:30:00', 'CareerFlow Office / Online', 'Cancelled', '2026-04-04 16:03:43'),
(7, 1, '2026-04-04 12:00:00', 'CareerFlow Office / Online', 'Scheduled', '2026-04-04 16:19:31'),
(8, 1, '2026-04-05 13:00:00', 'CareerFlow Office / Online', 'Cancelled', '2026-04-04 16:27:20'),
(9, 1, '2026-04-05 13:30:00', 'CareerFlow Office / Online', 'Scheduled', '2026-04-04 16:29:19'),
(10, 2, '2026-04-06 13:30:00', 'CareerFlow Office / Online', 'Scheduled', '2026-04-04 17:02:53'),
(11, 3, '2026-04-08 13:07:00', 'CareerFlow Office / Online', 'Completed', '2026-04-04 17:07:24');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `job_id` int(11) NOT NULL,
  `hr_id` int(11) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `vacancies` int(11) DEFAULT 1,
  `location` varchar(100) DEFAULT NULL,
  `employment_type` varchar(50) DEFAULT NULL,
  `salary_min` decimal(10,2) DEFAULT NULL,
  `salary_max` decimal(10,2) DEFAULT NULL,
  `pay_period` varchar(20) DEFAULT NULL,
  `education_level` varchar(50) DEFAULT NULL,
  `company_name` varchar(100) DEFAULT 'TPS',
  `salary_range` varchar(50) DEFAULT NULL,
  `required_skills` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','closed','paused','draft') DEFAULT 'active',
  `posted_at` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`job_id`, `hr_id`, `title`, `vacancies`, `location`, `employment_type`, `salary_min`, `salary_max`, `pay_period`, `education_level`, `company_name`, `salary_range`, `required_skills`, `description`, `status`, `posted_at`) VALUES
(1, 1, 'Jowa in ish', 1, 'pampanga', 'Full-time', 2000000.00, 50000000.00, 'Per Day', 'College Level', 'sdfzsdfzsdfzdf', NULL, '[]', 'dapat daw hindi humihinga tapos malaki (yung puso)', 'active', '2026-03-25'),
(2, 1, 'manananggal', 1, 'manila', 'Part-time', 6000.00, 10000.00, 'Per Week', 'High School Graduate', 'Camp Sawi', NULL, '[]', 'dapat magaling lumipad tapos hindi nakikita sa gabi', 'active', '2026-04-04');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `app_id` int(11) DEFAULT NULL,
  `message_text` text DEFAULT NULL,
  `message_type` enum('text','audio','file') DEFAULT 'text',
  `duration` varchar(10) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `otp_codes`
--

CREATE TABLE `otp_codes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `code` varchar(6) DEFAULT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE `profiles` (
  `profile_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `specialization` varchar(100) DEFAULT NULL,
  `education_level` varchar(50) DEFAULT NULL,
  `preferred_jobs` text DEFAULT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  `corporate_email` varchar(100) DEFAULT NULL,
  `company_size` varchar(20) DEFAULT NULL,
  `industry` varchar(50) DEFAULT NULL,
  `raw_image` longblob DEFAULT NULL,
  `processed_image` longblob DEFAULT NULL,
  `voice_transcript` text DEFAULT NULL,
  `completion_pct` int(11) DEFAULT 0,
  `skills` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profiles`
--

INSERT INTO `profiles` (`profile_id`, `user_id`, `first_name`, `last_name`, `phone`, `dob`, `gender`, `location`, `description`, `specialization`, `education_level`, `preferred_jobs`, `company_name`, `corporate_email`, `company_size`, `industry`, `raw_image`, `processed_image`, `voice_transcript`, `completion_pct`, `skills`) VALUES
(1, 1, 'Cyrus Jake', 'Camalla', '09972947232', '2006-12-08', 'Male', 'pampanga', 'Leading boys and girls to their ultimate experience', NULL, NULL, NULL, 'Camp Sawi', 'szdfdzfzdfzd@gmail.com', '201-1000', 'Construction', NULL, NULL, NULL, 0, NULL),
(2, 2, 'ian', 'narito', NULL, '2006-12-08', 'Male', 'xvjoidhfgxsyudvszumfvuxfsfvd', NULL, NULL, 'College', '[\"magnanakaw\"]', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(3, 3, 'Cyrus Jake ', 'Camalla', NULL, '2006-12-08', 'Male', 'SMART TOWER', NULL, NULL, 'College', '[\"lalakero\"]', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `resume_sections`
--

CREATE TABLE `resume_sections` (
  `section_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `section_type` enum('education','experience','skills','certifications') DEFAULT NULL,
  `content_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`content_json`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `saved_jobs`
--

CREATE TABLE `saved_jobs` (
  `save_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `saved_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `security_logs`
--

CREATE TABLE `security_logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action_performed` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `logged_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('job_seeker','hr','admin') DEFAULT 'job_seeker',
  `is_onboarded` tinyint(1) DEFAULT 0,
  `face_token` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `role`, `is_onboarded`, `face_token`, `created_at`) VALUES
(1, 'cyrus jake camalla', 'cjcamalla08@gmail.com', '$2b$10$tI0zLFu83zVvWu2snyc0Kujd/4vg.SOYHE4EkfqZNx1lym6lOOwsO', 'hr', 1, NULL, '2026-03-16 10:00:23'),
(2, 'ian narito', 'cjcamalla19@gmail.com', '$2b$10$rF3JSlEDh2z7Tv6PL5suWO3F7JpSYhxTmzXu/7Z8TG3q5q6oZ30nC', '', 1, NULL, '2026-03-20 14:38:08'),
(3, 'cyrus jake camalla', 'cjcamalla12@gmail.com', '$2b$10$99ib3R.5vdd3Gc/HH1p9T.Vn9cqkK1U/6ckFzYd0Fc8u6XB8WRszS', '', 1, NULL, '2026-03-21 18:44:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`app_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `job_id` (`job_id`);

--
-- Indexes for table `interviews`
--
ALTER TABLE `interviews`
  ADD PRIMARY KEY (`interview_id`),
  ADD KEY `app_id` (`app_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`job_id`),
  ADD KEY `hr_id` (`hr_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`);

--
-- Indexes for table `otp_codes`
--
ALTER TABLE `otp_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`profile_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `resume_sections`
--
ALTER TABLE `resume_sections`
  ADD PRIMARY KEY (`section_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD PRIMARY KEY (`save_id`),
  ADD UNIQUE KEY `unique_save` (`user_id`,`job_id`),
  ADD KEY `job_id` (`job_id`);

--
-- Indexes for table `security_logs`
--
ALTER TABLE `security_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `app_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `interviews`
--
ALTER TABLE `interviews`
  MODIFY `interview_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `job_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `otp_codes`
--
ALTER TABLE `otp_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `profile_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `resume_sections`
--
ALTER TABLE `resume_sections`
  MODIFY `section_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  MODIFY `save_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `security_logs`
--
ALTER TABLE `security_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`);

--
-- Constraints for table `interviews`
--
ALTER TABLE `interviews`
  ADD CONSTRAINT `interviews_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `applications` (`app_id`) ON DELETE CASCADE;

--
-- Constraints for table `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`hr_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `resume_sections`
--
ALTER TABLE `resume_sections`
  ADD CONSTRAINT `resume_sections_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD CONSTRAINT `saved_jobs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `saved_jobs_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE;

--
-- Constraints for table `security_logs`
--
ALTER TABLE `security_logs`
  ADD CONSTRAINT `security_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
