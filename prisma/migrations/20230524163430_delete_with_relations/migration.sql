-- DropForeignKey
ALTER TABLE `Course` DROP FOREIGN KEY `Course_teacherId_fkey`;

-- DropForeignKey
ALTER TABLE `CourseSubscription` DROP FOREIGN KEY `CourseSubscription_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `CourseSubscription` DROP FOREIGN KEY `CourseSubscription_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `File` DROP FOREIGN KEY `File_homeWorkAsignmentId_fkey`;

-- DropForeignKey
ALTER TABLE `File` DROP FOREIGN KEY `File_homeWorkId_fkey`;

-- DropForeignKey
ALTER TABLE `HomeWork` DROP FOREIGN KEY `HomeWork_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `HomeWorkAsignment` DROP FOREIGN KEY `HomeWorkAsignment_homeWorkId_fkey`;

-- DropForeignKey
ALTER TABLE `HomeWorkAsignment` DROP FOREIGN KEY `HomeWorkAsignment_studentId_fkey`;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseSubscription` ADD CONSTRAINT `CourseSubscription_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseSubscription` ADD CONSTRAINT `CourseSubscription_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeWork` ADD CONSTRAINT `HomeWork_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeWorkAsignment` ADD CONSTRAINT `HomeWorkAsignment_homeWorkId_fkey` FOREIGN KEY (`homeWorkId`) REFERENCES `HomeWork`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeWorkAsignment` ADD CONSTRAINT `HomeWorkAsignment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_homeWorkId_fkey` FOREIGN KEY (`homeWorkId`) REFERENCES `HomeWork`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_homeWorkAsignmentId_fkey` FOREIGN KEY (`homeWorkAsignmentId`) REFERENCES `HomeWorkAsignment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
