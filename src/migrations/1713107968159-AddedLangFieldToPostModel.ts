import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedLangFieldToPostModel1713107968159 implements MigrationInterface {
    name = 'AddedLangFieldToPostModel1713107968159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`lang\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`lang\``);
    }

}
