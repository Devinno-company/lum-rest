import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_login', table => {
        table.increments('cd_login').primary();
        table.string('nm_email', 255).notNullable();
        table.string('nm_password', 255).notNullable();
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_login');
}