import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_role', table => {
        table.string('sg_role', 3).primary();
        table.string('nm_role', 100).notNullable();
        table.string('ds_role', 255).notNullable();
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_role');
}