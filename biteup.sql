-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 23, 2025 at 05:18 AM
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
-- Database: `biteup`
--

-- --------------------------------------------------------

--
-- Table structure for table `costinghistory`
--

CREATE TABLE `costinghistory` (
  `history_id` varchar(20) NOT NULL,
  `product_id` varchar(20) NOT NULL,
  `costing_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customer_id` varchar(20) NOT NULL,
  `name` text NOT NULL,
  `contact_number` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `address` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `foodcosting`
--

CREATE TABLE `foodcosting` (
  `food_cost_id` varchar(20) NOT NULL,
  `history_id` varchar(20) NOT NULL,
  `product_id` varchar(20) NOT NULL,
  `total_cost` float NOT NULL,
  `profit_margin` float NOT NULL,
  `profit_per_portion` float NOT NULL,
  `food_cost%` float NOT NULL,
  `net_profit` float NOT NULL,
  `total_sales` float NOT NULL,
  `suggested_selling_price` float NOT NULL,
  `cost_of_ing_per_portion` float NOT NULL,
  `overhead` float NOT NULL,
  `desired#_portion` int(11) NOT NULL,
  `ing_weight_per_portion` float NOT NULL,
  `total_ing_weight` float NOT NULL,
  `unit_cost` float NOT NULL,
  `price_increase` float NOT NULL,
  `ingredient_cost_breakdown` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ingredient`
--

CREATE TABLE `ingredient` (
  `ingredient_id` varchar(20) NOT NULL,
  `name` varchar(60) NOT NULL,
  `brand` varchar(60) NOT NULL,
  `unit` varchar(10) NOT NULL,
  `price` float NOT NULL,
  `purchase_date` date NOT NULL,
  `quantity` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventorylog`
--

CREATE TABLE `inventorylog` (
  `log_id` varchar(20) NOT NULL,
  `product_id` varchar(20) NOT NULL,
  `ingredient_id` varchar(20) NOT NULL,
  `quantity_changed` int(11) NOT NULL,
  `unit_price` float NOT NULL,
  `date_logged` date NOT NULL,
  `source` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orderhistory`
--

CREATE TABLE `orderhistory` (
  `orderhistory_id` varchar(20) NOT NULL,
  `customer_id` varchar(20) NOT NULL,
  `order_id` varchar(20) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orderitem`
--

CREATE TABLE `orderitem` (
  `order_item_id` varchar(20) NOT NULL,
  `order_id` varchar(20) NOT NULL,
  `product_id` varchar(20) NOT NULL,
  `quantity_ordered` int(11) NOT NULL,
  `price_per_unit` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orderkb`
--

CREATE TABLE `orderkb` (
  `order_item_id` varchar(20) NOT NULL,
  `customer_id` varchar(20) NOT NULL,
  `order_id` varchar(20) NOT NULL,
  `order_date` date NOT NULL,
  `total_amount` float NOT NULL,
  `status` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `product_id` varchar(20) NOT NULL,
  `product_ingredient_id` varchar(20) NOT NULL,
  `name` varchar(60) NOT NULL,
  `description` text NOT NULL,
  `unit_cost` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `productingredient`
--

CREATE TABLE `productingredient` (
  `product_ingredient_id` varchar(20) NOT NULL,
  `product_id` varchar(20) NOT NULL,
  `ingredient_id` varchar(20) NOT NULL,
  `quantity_used` int(11) NOT NULL,
  `unit` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `receipt`
--

CREATE TABLE `receipt` (
  `receipt_id` varchar(20) NOT NULL,
  `receipt_item_id` varchar(20) NOT NULL,
  `receipt_date` date NOT NULL,
  `supplier_name` text NOT NULL,
  `total_cost` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `receiptitem`
--

CREATE TABLE `receiptitem` (
  `receipt_item_id` varchar(20) NOT NULL,
  `receipt_id` varchar(20) NOT NULL,
  `ingredient_id` varchar(20) NOT NULL,
  `unit_price` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salesrecord`
--

CREATE TABLE `salesrecord` (
  `record_id` varchar(20) NOT NULL,
  `record_date` date NOT NULL,
  `product_id` varchar(20) NOT NULL,
  `units_sold` float NOT NULL,
  `total_sales` float NOT NULL,
  `average_price` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `costinghistory`
--
ALTER TABLE `costinghistory`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `product_id_fk4` (`product_id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `foodcosting`
--
ALTER TABLE `foodcosting`
  ADD PRIMARY KEY (`food_cost_id`),
  ADD KEY `history_id_fk` (`history_id`),
  ADD KEY `product_id_fk5` (`product_id`);

--
-- Indexes for table `ingredient`
--
ALTER TABLE `ingredient`
  ADD PRIMARY KEY (`ingredient_id`);

--
-- Indexes for table `inventorylog`
--
ALTER TABLE `inventorylog`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `product_id_fk3` (`product_id`),
  ADD KEY `ingredient_id_fk3` (`ingredient_id`);

--
-- Indexes for table `orderhistory`
--
ALTER TABLE `orderhistory`
  ADD PRIMARY KEY (`orderhistory_id`),
  ADD KEY `customer_id_fk` (`customer_id`),
  ADD KEY `order_id_fk` (`order_id`);

--
-- Indexes for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id_fk2` (`order_id`),
  ADD KEY `product_id_fk2` (`product_id`);

--
-- Indexes for table `orderkb`
--
ALTER TABLE `orderkb`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `customer_id_fk2` (`customer_id`),
  ADD KEY `order_item_id_fk` (`order_item_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `product_ingredient_id_fk` (`product_ingredient_id`);

--
-- Indexes for table `productingredient`
--
ALTER TABLE `productingredient`
  ADD PRIMARY KEY (`product_ingredient_id`),
  ADD KEY `product_id_fk` (`product_id`),
  ADD KEY `ingredient_id_fk` (`ingredient_id`);

--
-- Indexes for table `receipt`
--
ALTER TABLE `receipt`
  ADD PRIMARY KEY (`receipt_id`),
  ADD KEY `receipt_item_id_fk` (`receipt_item_id`);

--
-- Indexes for table `receiptitem`
--
ALTER TABLE `receiptitem`
  ADD PRIMARY KEY (`receipt_item_id`),
  ADD KEY `receipt_id_fk` (`receipt_id`),
  ADD KEY `ingredient_id_fk2` (`ingredient_id`);

--
-- Indexes for table `salesrecord`
--
ALTER TABLE `salesrecord`
  ADD PRIMARY KEY (`record_id`),
  ADD KEY `product_id_fk6` (`product_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `costinghistory`
--
ALTER TABLE `costinghistory`
  ADD CONSTRAINT `product_id_fk4` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`);

--
-- Constraints for table `foodcosting`
--
ALTER TABLE `foodcosting`
  ADD CONSTRAINT `history_id_fk` FOREIGN KEY (`history_id`) REFERENCES `costinghistory` (`history_id`),
  ADD CONSTRAINT `product_id_fk5` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`);

--
-- Constraints for table `inventorylog`
--
ALTER TABLE `inventorylog`
  ADD CONSTRAINT `ingredient_id_fk3` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient` (`ingredient_id`),
  ADD CONSTRAINT `product_id_fk3` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`);

--
-- Constraints for table `orderhistory`
--
ALTER TABLE `orderhistory`
  ADD CONSTRAINT `customer_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`),
  ADD CONSTRAINT `order_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orderkb` (`order_id`);

--
-- Constraints for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD CONSTRAINT `order_id_fk2` FOREIGN KEY (`order_id`) REFERENCES `orderkb` (`order_id`),
  ADD CONSTRAINT `product_id_fk2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`);

--
-- Constraints for table `orderkb`
--
ALTER TABLE `orderkb`
  ADD CONSTRAINT `customer_id_fk2` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`),
  ADD CONSTRAINT `order_item_id_fk` FOREIGN KEY (`order_item_id`) REFERENCES `orderhistory` (`orderhistory_id`);

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ingredient_id_fk` FOREIGN KEY (`product_ingredient_id`) REFERENCES `productingredient` (`product_ingredient_id`);

--
-- Constraints for table `productingredient`
--
ALTER TABLE `productingredient`
  ADD CONSTRAINT `ingredient_id_fk` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient` (`ingredient_id`),
  ADD CONSTRAINT `product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`);

--
-- Constraints for table `receipt`
--
ALTER TABLE `receipt`
  ADD CONSTRAINT `receipt_item_id_fk` FOREIGN KEY (`receipt_item_id`) REFERENCES `receiptitem` (`receipt_item_id`);

--
-- Constraints for table `receiptitem`
--
ALTER TABLE `receiptitem`
  ADD CONSTRAINT `ingredient_id_fk2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient` (`ingredient_id`),
  ADD CONSTRAINT `receipt_id_fk` FOREIGN KEY (`receipt_id`) REFERENCES `receipt` (`receipt_id`);

--
-- Constraints for table `salesrecord`
--
ALTER TABLE `salesrecord`
  ADD CONSTRAINT `product_id_fk6` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
