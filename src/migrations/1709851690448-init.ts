import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1709851690448 implements MigrationInterface {
    name = 'Init1709851690448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`text\` text NULL, \`postDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`postId\` bigint NOT NULL, \`postLink\` varchar(255) NULL, \`chatId\` bigint NOT NULL, \`groupedId\` bigint NOT NULL, \`views\` bigint NOT NULL DEFAULT '0', \`forwards\` bigint NOT NULL DEFAULT '0', \`reactions\` json NULL, \`channelId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`channel\` (\`id\` int NOT NULL AUTO_INCREMENT, \`channelId\` bigint NOT NULL, \`title\` varchar(255) NOT NULL, \`username\` varchar(255) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_ce6adfd740251275f50001afe6\` (\`channelId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` bigint NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NULL, \`username\` varchar(255) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`summary_reaction\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('like', 'dislike') NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, \`themeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`summary_theme\` (\`id\` int NOT NULL AUTO_INCREMENT, \`label\` varchar(200) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_32b5747505ae0c8b3aa368b8a3\` (\`label\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`summary_chunk\` (\`id\` int NOT NULL AUTO_INCREMENT, \`text\` text NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`summaryId\` int NULL, \`themeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`summary\` (\`id\` int NOT NULL AUTO_INCREMENT, \`rawText\` text NULL, \`isApproved\` tinyint NOT NULL DEFAULT 0, \`isSubmitted\` tinyint NOT NULL DEFAULT 0, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_f008dabd69bf5d926240adfbb85\` FOREIGN KEY (\`channelId\`) REFERENCES \`channel\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`summary_reaction\` ADD CONSTRAINT \`FK_a5efddef7d68d08cb1c190d2cbf\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`summary_reaction\` ADD CONSTRAINT \`FK_0cd132fe60c165c79ef80c6367f\` FOREIGN KEY (\`themeId\`) REFERENCES \`summary_theme\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`summary_chunk\` ADD CONSTRAINT \`FK_483dd340036fc9fafebca210f90\` FOREIGN KEY (\`summaryId\`) REFERENCES \`summary\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`summary_chunk\` ADD CONSTRAINT \`FK_39aad2d216e244be08353decdf7\` FOREIGN KEY (\`themeId\`) REFERENCES \`summary_theme\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`summary_chunk\` DROP FOREIGN KEY \`FK_39aad2d216e244be08353decdf7\``);
        await queryRunner.query(`ALTER TABLE \`summary_chunk\` DROP FOREIGN KEY \`FK_483dd340036fc9fafebca210f90\``);
        await queryRunner.query(`ALTER TABLE \`summary_reaction\` DROP FOREIGN KEY \`FK_0cd132fe60c165c79ef80c6367f\``);
        await queryRunner.query(`ALTER TABLE \`summary_reaction\` DROP FOREIGN KEY \`FK_a5efddef7d68d08cb1c190d2cbf\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_f008dabd69bf5d926240adfbb85\``);
        await queryRunner.query(`DROP TABLE \`summary\``);
        await queryRunner.query(`DROP TABLE \`summary_chunk\``);
        await queryRunner.query(`DROP INDEX \`IDX_32b5747505ae0c8b3aa368b8a3\` ON \`summary_theme\``);
        await queryRunner.query(`DROP TABLE \`summary_theme\``);
        await queryRunner.query(`DROP TABLE \`summary_reaction\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_ce6adfd740251275f50001afe6\` ON \`channel\``);
        await queryRunner.query(`DROP TABLE \`channel\``);
        await queryRunner.query(`DROP TABLE \`post\``);
    }

}
