import { MigrationInterface, QueryRunner } from "typeorm";

export class SummaryChunkItem1710446738374 implements MigrationInterface {
    name = 'SummaryChunkItem1710446738374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`summary_chunk_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`text\` text NULL, \`isApproved\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`chunkId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`summary_chunk\` DROP COLUMN \`text\``);
        await queryRunner.query(`ALTER TABLE \`summary\` DROP COLUMN \`isApproved\``);
        await queryRunner.query(`ALTER TABLE \`summary_chunk\` ADD \`title\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`summary_chunk\` ADD \`rawText\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`summary_chunk_item\` ADD CONSTRAINT \`FK_6392e41af25f599e3dd23776d0b\` FOREIGN KEY (\`chunkId\`) REFERENCES \`summary_chunk\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`summary_chunk_item\` DROP FOREIGN KEY \`FK_6392e41af25f599e3dd23776d0b\``);
        await queryRunner.query(`ALTER TABLE \`summary_chunk\` DROP COLUMN \`rawText\``);
        await queryRunner.query(`ALTER TABLE \`summary_chunk\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`summary\` ADD \`isApproved\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`summary_chunk\` ADD \`text\` text NULL`);
        await queryRunner.query(`DROP TABLE \`summary_chunk_item\``);
    }

}
