import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveAndLastSummaryDateFields1711359057638 implements MigrationInterface {
    name = 'AddIsActiveAndLastSummaryDateFields1711359057638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`isActive\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`lastSummaryDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_d72ea127f30e21753c9e229891\` (\`userId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_d72ea127f30e21753c9e229891\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`lastSummaryDate\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`isActive\``);
    }

}
