import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_country', table => {
        table.increments('cd_country').primary();
        table.string('nm_country', 100).notNullable();
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_country');
}