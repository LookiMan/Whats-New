import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSummaryLabel1710093721584 implements MigrationInterface {
    name = 'AddSummaryLabel1710093721584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`summary\` ADD \`label\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`summary\` DROP COLUMN \`label\``);
    }

}
