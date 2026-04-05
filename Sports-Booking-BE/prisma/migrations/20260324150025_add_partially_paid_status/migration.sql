-- AlterTable
ALTER TABLE `bookings` MODIFY `payment_status` ENUM('unpaid', 'paid', 'refunded', 'partially_paid') NOT NULL DEFAULT 'unpaid';
