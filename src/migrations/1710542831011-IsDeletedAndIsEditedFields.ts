import { MigrationInterface, QueryRunner } from "typeorm";

export class IsDeletedAndIsEditedFields1710542831011 implements MigrationInterface {
    name = 'IsDeletedAndIsEditedFields1710542831011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`isDeleted\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`isEdited\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`isEdited\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`isDeleted\``);
    }

}
