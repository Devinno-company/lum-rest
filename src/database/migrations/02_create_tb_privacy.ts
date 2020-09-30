import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_privacy', table => {
        table.string('sg_privacy', 3).primary();
        table.string('nm_privacy', 100).notNullable();
        table.string('ds_privacy', 255).notNullable();
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_privacy');
}