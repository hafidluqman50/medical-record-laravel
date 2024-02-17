/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `card_stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card_stocks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date_stock` date NOT NULL,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'layanan; Ex: Beli, Jual, Retur',
  `medicine_id` bigint unsigned NOT NULL,
  `buy` int NOT NULL,
  `sell` int NOT NULL,
  `return` int NOT NULL,
  `accumulated_stock` int NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `card_stocks_medicine_id_foreign` (`medicine_id`),
  CONSTRAINT `card_stocks_medicine_id_foreign` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `debitur_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_parameter_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `customers_price_parameter_id_foreign` (`price_parameter_id`),
  CONSTRAINT `customers_price_parameter_id_foreign` FOREIGN KEY (`price_parameter_id`) REFERENCES `price_parameters` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `distribution_medicine_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `distribution_medicine_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `distribution_medicine_id` bigint unsigned NOT NULL,
  `medicine_id` bigint unsigned NOT NULL,
  `qty` int NOT NULL,
  `stock_per_unit` int NOT NULL COMMENT 'Isi Obat Per Satuan',
  `unit_order` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `distribution_medicine_details_distribution_medicine_id_foreign` (`distribution_medicine_id`),
  KEY `distribution_medicine_details_medicine_id_foreign` (`medicine_id`),
  CONSTRAINT `distribution_medicine_details_distribution_medicine_id_foreign` FOREIGN KEY (`distribution_medicine_id`) REFERENCES `distribution_medicines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `distribution_medicine_details_medicine_id_foreign` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `distribution_medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `distribution_medicines` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_distribution` date NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `distribution_medicines_user_id_foreign` (`user_id`),
  CONSTRAINT `distribution_medicines_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fee` int NOT NULL,
  `status_doctor` int NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `drug_classifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drug_classifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_prekursor` int NOT NULL,
  `is_narcotic` int NOT NULL,
  `is_psychotropic` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `medical_record_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_record_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `medical_record_list_id` bigint unsigned NOT NULL,
  `medicine_id` bigint unsigned NOT NULL,
  `qty` int NOT NULL,
  `dose` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `medical_record_details_medical_record_list_id_foreign` (`medical_record_list_id`),
  KEY `medical_record_details_medicine_id_foreign` (`medicine_id`),
  CONSTRAINT `medical_record_details_medical_record_list_id_foreign` FOREIGN KEY (`medical_record_list_id`) REFERENCES `medical_record_lists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medical_record_details_medicine_id_foreign` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `medical_record_lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_record_lists` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `medical_record_id` bigint unsigned NOT NULL,
  `registration_id` bigint unsigned NOT NULL,
  `date_check_up` date NOT NULL,
  `body_height` double NOT NULL,
  `body_weight` double NOT NULL,
  `body_temp` double NOT NULL,
  `blood_pressure` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `main_complaint` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `diagnose` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `anemnesis` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `physical_examinations` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `supporting_examinations` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `therapy` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `next_control_date` date NOT NULL COMMENT 'tanggal kontrol selanjutnya',
  `lab_action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `medical_record_lists_medical_record_id_foreign` (`medical_record_id`),
  KEY `medical_record_lists_registration_id_foreign` (`registration_id`),
  CONSTRAINT `medical_record_lists_medical_record_id_foreign` FOREIGN KEY (`medical_record_id`) REFERENCES `medical_records` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medical_record_lists_registration_id_foreign` FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `medical_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `medical_records_patient_id_foreign` (`patient_id`),
  CONSTRAINT `medical_records_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `medical_suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_suppliers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abbreviation_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `medicine_factories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicine_factories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicines` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_expired` date NOT NULL,
  `batch_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `barcode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `drug_classification_id` bigint unsigned NOT NULL,
  `medical_supplier_id` bigint unsigned NOT NULL,
  `medicine_factory_id` bigint unsigned NOT NULL,
  `min_stock_supplier` int NOT NULL COMMENT 'minimal stok harus supply',
  `is_generic` int NOT NULL COMMENT 'generic; jika generic maka 1',
  `is_active` int NOT NULL COMMENT 'active; jika aktif maka 1',
  `is_prescription` int NOT NULL COMMENT 'resep; jika aktif maka 1',
  `stock` int NOT NULL COMMENT 'stok obat',
  `piece_weight` int NOT NULL COMMENT 'bobot satuan',
  `pack_medicine` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'kemasan obat',
  `unit_medicine` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'satuan obat',
  `medicinal_preparations` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'sediaan obat',
  `location_rack` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'lokasi rak',
  `dose` int NOT NULL COMMENT 'dosis obat',
  `composition` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'komposisi',
  `is_fullpack` int NOT NULL COMMENT 'utuh; jika utuh maka nilai nya 1, digunakan untuk mencatat harga utuh atau tidak',
  `capital_price` int NOT NULL COMMENT 'harga modal',
  `capital_price_vat` int NOT NULL COMMENT 'harga modal ppn',
  `sell_price` int NOT NULL COMMENT 'hja/net',
  `data_location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'lokasi data; Ex: gudang, kasir;',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `medicines_drug_classification_id_foreign` (`drug_classification_id`),
  KEY `medicines_medical_supplier_id_foreign` (`medical_supplier_id`),
  KEY `medicines_medicine_factory_id_foreign` (`medicine_factory_id`),
  CONSTRAINT `medicines_drug_classification_id_foreign` FOREIGN KEY (`drug_classification_id`) REFERENCES `drug_classifications` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `medicines_medical_supplier_id_foreign` FOREIGN KEY (`medical_supplier_id`) REFERENCES `medical_suppliers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `medicines_medicine_factory_id_foreign` FOREIGN KEY (`medicine_factory_id`) REFERENCES `medicine_factories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `order_medicine_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_medicine_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_medicine_id` bigint unsigned NOT NULL,
  `medicine_id` bigint unsigned NOT NULL,
  `qty` int NOT NULL,
  `price` int NOT NULL COMMENT 'HARGA HNA',
  `stock_per_unit` int NOT NULL COMMENT 'Isi Obat Per Satuan',
  `unit_order` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sub_total` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_medicine_details_order_medicine_id_foreign` (`order_medicine_id`),
  KEY `order_medicine_details_medicine_id_foreign` (`medicine_id`),
  CONSTRAINT `order_medicine_details_medicine_id_foreign` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `order_medicine_details_order_medicine_id_foreign` FOREIGN KEY (`order_medicine_id`) REFERENCES `order_medicines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `order_medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_medicines` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_order` date NOT NULL,
  `medical_supplier_id` bigint unsigned NOT NULL,
  `total_grand` int NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_medicines_medical_supplier_id_foreign` (`medical_supplier_id`),
  KEY `order_medicines_user_id_foreign` (`user_id`),
  CONSTRAINT `order_medicines_medical_supplier_id_foreign` FOREIGN KEY (`medical_supplier_id`) REFERENCES `medical_suppliers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `order_medicines_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `patient_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bpjs_number` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `patient_category_id` bigint unsigned NOT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `city_place` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `birth_date` date NOT NULL,
  `gender` enum('laki-laki','perempuan') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `patients_patient_category_id_foreign` (`patient_category_id`),
  CONSTRAINT `patients_patient_category_id_foreign` FOREIGN KEY (`patient_category_id`) REFERENCES `patient_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ppn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ppn` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nilai_ppn` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ppns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ppns` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `prescription_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescription_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `prescription_list_id` bigint unsigned NOT NULL,
  `medicine_id` bigint unsigned NOT NULL,
  `qty` int NOT NULL,
  `prescription_packs` int NOT NULL,
  `dose` int NOT NULL,
  `sub_total` int NOT NULL,
  `service_fee` int NOT NULL,
  `total` int NOT NULL,
  `prescription_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `faktor` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `prescription_details_prescription_list_id_foreign` (`prescription_list_id`),
  KEY `prescription_details_medicine_id_foreign` (`medicine_id`),
  CONSTRAINT `prescription_details_medicine_id_foreign` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `prescription_details_prescription_list_id_foreign` FOREIGN KEY (`prescription_list_id`) REFERENCES `prescription_lists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `prescription_lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescription_lists` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `prescription_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_fee` int NOT NULL,
  `total_costs` int NOT NULL,
  `total_prescription_packs` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `prescription_lists_prescription_id_foreign` (`prescription_id`),
  CONSTRAINT `prescription_lists_prescription_id_foreign` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescriptions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint unsigned NOT NULL,
  `doctor_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `prescriptions_patient_id_foreign` (`patient_id`),
  KEY `prescriptions_doctor_id_foreign` (`doctor_id`),
  CONSTRAINT `prescriptions_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `prescriptions_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `price_parameters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `price_parameters` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resep_tunai` double NOT NULL,
  `upds` double NOT NULL,
  `hv_otc` double NOT NULL,
  `resep_kredit` double NOT NULL,
  `enggros_faktur` double NOT NULL,
  `embalase` int NOT NULL,
  `jasa_racik` int NOT NULL,
  `pembulatan` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `purchase_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_histories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_purchase` date NOT NULL,
  `medical_supplier_id` bigint unsigned NOT NULL,
  `medicine_id` bigint unsigned NOT NULL,
  `qty` int NOT NULL,
  `unit_medicine` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sub_total` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `purchase_histories_medical_supplier_id_foreign` (`medical_supplier_id`),
  KEY `purchase_histories_medicine_id_foreign` (`medicine_id`),
  CONSTRAINT `purchase_histories_medical_supplier_id_foreign` FOREIGN KEY (`medical_supplier_id`) REFERENCES `medical_suppliers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `purchase_histories_medicine_id_foreign` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `purchase_medicine_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_medicine_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `purchase_medicine_id` bigint unsigned NOT NULL,
  `medicine_id` bigint unsigned NOT NULL,
  `qty` int NOT NULL,
  `price` int NOT NULL,
  `ppn` int NOT NULL,
  `disc_1` double NOT NULL,
  `disc_2` double NOT NULL,
  `disc_3` double NOT NULL,
  `ppn_type` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sub_total` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `purchase_medicine_details_purchase_medicine_id_foreign` (`purchase_medicine_id`),
  KEY `purchase_medicine_details_medicine_id_foreign` (`medicine_id`),
  CONSTRAINT `purchase_medicine_details_medicine_id_foreign` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `purchase_medicine_details_purchase_medicine_id_foreign` FOREIGN KEY (`purchase_medicine_id`) REFERENCES `purchase_medicines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `purchase_medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_medicines` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `medical_supplier_id` bigint unsigned NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_receive` date NOT NULL COMMENT 'tanggal penerimaan',
  `debt_time` int NOT NULL COMMENT 'waktu hutang; ex: 1 hari, 2 hari',
  `due_date` date NOT NULL COMMENT 'tanggal jatuh tempo',
  `type` enum('cash','kredit','konsinyasi') COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_dpp` int NOT NULL,
  `total_ppn` int NOT NULL,
  `total_discount` int NOT NULL,
  `total_grand` int NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `purchase_medicines_medical_supplier_id_foreign` (`medical_supplier_id`),
  KEY `purchase_medicines_user_id_foreign` (`user_id`),
  CONSTRAINT `purchase_medicines_medical_supplier_id_foreign` FOREIGN KEY (`medical_supplier_id`) REFERENCES `medical_suppliers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `purchase_medicines_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `purchase_return_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_return_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `purchase_return_id` bigint unsigned NOT NULL,
  `medicine_id` bigint unsigned NOT NULL,
  `qty_purchase` int NOT NULL COMMENT 'Stok dari pembelian',
  `qty_return` int NOT NULL COMMENT 'Stok yang diretur',
  `sub_total` int NOT NULL,
  `sub_total_custom` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `purchase_return_details_purchase_return_id_foreign` (`purchase_return_id`),
  KEY `purchase_return_details_medicine_id_foreign` (`medicine_id`),
  CONSTRAINT `purchase_return_details_medicine_id_foreign` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `purchase_return_details_purchase_return_id_foreign` FOREIGN KEY (`purchase_return_id`) REFERENCES `purchase_returns` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `purchase_returns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_returns` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoice_number_purchase` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `medical_supplier_id` bigint unsigned NOT NULL,
  `date_return` date NOT NULL,
  `date_return_purchase` date NOT NULL,
  `total_return` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `purchase_returns_medical_supplier_id_foreign` (`medical_supplier_id`),
  CONSTRAINT `purchase_returns_medical_supplier_id_foreign` FOREIGN KEY (`medical_supplier_id`) REFERENCES `medical_suppliers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `receiving_medicine_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receiving_medicine_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `receiving_medicine_id` bigint unsigned NOT NULL,
  `medicine_id` bigint unsigned NOT NULL,
  `qty` int NOT NULL,
  `price` int NOT NULL COMMENT 'HARGA HNA',
  `stock_per_unit` int NOT NULL COMMENT 'Isi Obat Per Satuan',
  `unit_order` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sub_total` int NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `receiving_medicine_details_receiving_medicine_id_foreign` (`receiving_medicine_id`),
  KEY `receiving_medicine_details_medicine_id_foreign` (`medicine_id`),
  CONSTRAINT `receiving_medicine_details_medicine_id_foreign` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `receiving_medicine_details_receiving_medicine_id_foreign` FOREIGN KEY (`receiving_medicine_id`) REFERENCES `receiving_medicines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `receiving_medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receiving_medicines` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_receive` date NOT NULL,
  `total_grand` int NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `receiving_medicines_user_id_foreign` (`user_id`),
  CONSTRAINT `receiving_medicines_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registrations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date_register` date NOT NULL,
  `number_register` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `patient_id` bigint unsigned NOT NULL,
  `doctor_id` bigint unsigned NOT NULL,
  `body_height` double DEFAULT NULL,
  `body_weight` double DEFAULT NULL,
  `body_temp` double DEFAULT NULL,
  `blood_pressure` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `complains_of_pain` text COLLATE utf8mb4_unicode_ci,
  `supporting_examinations` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_register` int NOT NULL COMMENT '0: Untuk Belum Diperiksa Dokter; 1: Untuk sudah diperiksa dokter;',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `registrations_patient_id_foreign` (`patient_id`),
  KEY `registrations_doctor_id_foreign` (`doctor_id`),
  CONSTRAINT `registrations_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `registrations_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sales_return_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_return_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sales_return_id` bigint unsigned NOT NULL,
  `medicine_id` bigint unsigned NOT NULL,
  `qty_transaction` int NOT NULL COMMENT 'Stok dari penjualan(resep, upds, HV)',
  `qty_return` int NOT NULL COMMENT 'Stok yang diretur',
  `sub_total` int NOT NULL,
  `sub_total_custom` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_return_details_sales_return_id_foreign` (`sales_return_id`),
  KEY `sales_return_details_medicine_id_foreign` (`medicine_id`),
  CONSTRAINT `sales_return_details_medicine_id_foreign` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `sales_return_details_sales_return_id_foreign` FOREIGN KEY (`sales_return_id`) REFERENCES `sales_returns` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sales_returns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_returns` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoice_number_transaction` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_return` date NOT NULL,
  `date_return_transaction` date NOT NULL,
  `total_return` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `transaction_credits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_credits` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_transaction` date NOT NULL,
  `date_prescription` date NOT NULL,
  `customer_id` bigint unsigned NOT NULL,
  `group_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prescription_id` bigint unsigned NOT NULL,
  `sub_total` int NOT NULL,
  `total` int NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `status_transaction` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transaction_credits_customer_id_foreign` (`customer_id`),
  KEY `transaction_credits_prescription_id_foreign` (`prescription_id`),
  KEY `transaction_credits_user_id_foreign` (`user_id`),
  CONSTRAINT `transaction_credits_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `transaction_credits_prescription_id_foreign` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `transaction_credits_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `transaction_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `transaction_id` bigint unsigned NOT NULL,
  `medicine_id` bigint unsigned NOT NULL,
  `qty` int NOT NULL,
  `sub_total` int NOT NULL,
  `discount` int NOT NULL,
  `total` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transaction_details_transaction_id_foreign` (`transaction_id`),
  KEY `transaction_details_medicine_id_foreign` (`medicine_id`),
  CONSTRAINT `transaction_details_medicine_id_foreign` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `transaction_details_transaction_id_foreign` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `transaction_prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_prescriptions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_transaction` date NOT NULL,
  `prescription_id` bigint unsigned NOT NULL,
  `sub_total` int NOT NULL,
  `discount` int NOT NULL,
  `total` int NOT NULL,
  `pay_total` int NOT NULL,
  `change_money` int NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `transaction_pay_type` enum('tunai','kartu-debit-kredit') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_transaction` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transaction_prescriptions_prescription_id_foreign` (`prescription_id`),
  KEY `transaction_prescriptions_user_id_foreign` (`user_id`),
  CONSTRAINT `transaction_prescriptions_prescription_id_foreign` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `transaction_prescriptions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date_transaction` date NOT NULL,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sub_total` int NOT NULL,
  `discount` int NOT NULL COMMENT 'total diskon untuk diskon dari sub total dan total sebelum bayar',
  `discount_pay` int NOT NULL COMMENT 'total diskon untuk pembayaran',
  `total` int NOT NULL,
  `pay_total` int NOT NULL COMMENT 'uang bayar',
  `change_money` int NOT NULL COMMENT 'uang kembalian',
  `transaction_pay_type` enum('tunai','kartu-debit-kredit') COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('UP','HV') COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transactions_user_id_foreign` (`user_id`),
  CONSTRAINT `transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role_id` bigint unsigned DEFAULT NULL,
  `status_user` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `users_role_id_foreign` (`role_id`),
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (1,'2014_10_12_000000_create_users_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (2,'2014_10_12_100000_create_password_reset_tokens_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (3,'2019_08_19_000000_create_failed_jobs_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (4,'2019_12_14_000001_create_personal_access_tokens_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (5,'2024_02_02_140000_add_field_username_in_users_table',2);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (6,'2024_02_02_141021_create_doctors_table',3);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (7,'2024_02_03_062310_create_patient_categories_table',4);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (9,'2024_02_03_105735_create_patients_table',5);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (12,'2024_02_04_074931_create_registrations_table',6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (13,'2024_02_04_183621_create_drug_classifications_table',7);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (14,'2024_02_05_054722_create_medical_suppliers_table',8);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (15,'2024_02_05_075637_create_medicine_factories_table',9);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (23,'2024_02_05_152002_create_medicines_table',10);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (30,'2024_02_06_151801_create_transactions_table',11);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (31,'2024_02_06_151807_create_transaction_details_table',11);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (32,'2024_02_07_121629_create_price_parameters_table',12);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (33,'2024_02_07_155504_create_roles_table',13);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (34,'2024_02_07_155522_add_role_in_users_table',13);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (35,'2024_02_07_165820_drop_email_in_users_table',14);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (36,'2024_02_07_171947_add_soft_deletes_in_users_table',15);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (38,'2024_02_07_224720_create_ppns_table',16);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (44,'2024_02_10_213839_create_customers_table',19);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (45,'2024_02_08_222747_create_prescriptions_table',20);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (46,'2024_02_08_222751_create_prescription_lists_table',20);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (47,'2024_02_08_222800_create_prescription_details_table',20);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (48,'2024_02_08_222909_create_transaction_prescriptions_table',20);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (50,'2024_02_10_231951_create_transaction_credits_table',21);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (51,'2024_02_12_132920_create_purchase_medicines_table',22);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (52,'2024_02_12_132926_create_purchase_medicine_details_table',22);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (53,'2024_02_13_122701_create_order_medicines_table',23);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (54,'2024_02_13_122711_create_order_medicine_details_table',23);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (55,'2024_02_13_212053_create_receiving_medicines_table',24);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (56,'2024_02_13_212103_create_receiving_medicine_details_table',24);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (57,'2024_02_14_000651_create_distribution_medicines_table',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (58,'2024_02_14_000702_create_distribution_medicine_details_table',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (59,'2024_02_14_095250_create_card_stocks_table',26);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (61,'2024_02_14_095327_create_purchase_histories_table',27);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (62,'2024_02_14_231034_create_sales_returns_table',28);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (63,'2024_02_14_231040_create_sales_return_details_table',28);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (64,'2024_02_16_005439_create_purchase_returns_table',29);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (65,'2024_02_16_005452_create_purchase_return_details_table',29);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (66,'2024_02_16_142258_create_medical_records_table',30);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (67,'2024_02_16_142920_create_medical_record_lists_table',30);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (68,'2024_02_16_142928_create_medical_record_details_table',30);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (69,'2024_02_18_004311_add_dose_into_prescription_details_table',31);
