import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeactivationDateField1711367689176 implements MigrationInterface {
    name = 'AddDeactivationDateField1711367689176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`deactivationDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`deactivationDate\``);
    }

}
