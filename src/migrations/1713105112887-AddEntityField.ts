import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEntityField1713105112887 implements MigrationInterface {
    name = 'AddEntityField1713105112887'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`entities\` json NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`entities\``);
    }

}
