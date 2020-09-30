import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_category', table => {
        table.string('sg_category', 3).primary();
        table.string('nm_category', 100).notNullable();
        table.string('ds_category', 255).notNullable();
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_category');
}