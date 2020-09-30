import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_geolocation', table => {
        table.increments('cd_geolocation').primary();
        table.decimal('cd_latitude', 8, 5).notNullable();
        table.decimal('cd_longitude', 8, 5).notNullable();
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_geolocation');
}