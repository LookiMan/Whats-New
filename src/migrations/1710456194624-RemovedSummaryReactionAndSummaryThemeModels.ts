import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedSummaryReactionAndSummaryThemeModels1710456194624 implements MigrationInterface {
    name = 'RemovedSummaryReactionAndSummaryThemeModels1710456194624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`summary_chunk\` DROP FOREIGN KEY \`FK_39aad2d216e244be08353decdf7\``);
        await queryRunner.query(`ALTER TABLE \`summary_chunk\` DROP COLUMN \`themeId\``);
        await queryRunner.query(`DROP TABLE \`summary_reaction\``);
        await queryRunner.query(`DROP TABLE \`summary_theme\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`summary_reaction\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('like', 'dislike') NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, \`themeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`summary_theme\` (\`id\` int NOT NULL AUTO_INCREMENT, \`label\` varchar(200) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_32b5747505ae0c8b3aa368b8a3\` (\`label\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`summary_chunk\` ADD \`themeId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`summary_chunk\` ADD CONSTRAINT \`FK_39aad2d216e244be08353decdf7\` FOREIGN KEY (\`themeId\`) REFERENCES \`summary_theme\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
