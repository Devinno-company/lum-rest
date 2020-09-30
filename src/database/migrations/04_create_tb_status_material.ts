import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_status_material', table => {
        table.string('sg_status', 3).primary();
        table.string('nm_status', 100).notNullable();
        table.string('ds_status', 255).notNullable();
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_status_material');
}