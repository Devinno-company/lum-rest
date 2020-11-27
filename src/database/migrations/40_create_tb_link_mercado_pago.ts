import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_link_mercado_pago', table => {
        table.increments('cd_link_mercado_pago').primary();
        table.string('cd_identification').notNullable();
        table.string('cd_refresh_token');
        table.string('cd_access_token');
        table.string('cd_public_key');
        table.integer('cd_user_mercado_pago')
        table.boolean('id_valid').notNullable().defaultTo(false);
        table.date('dt_issue').notNullable().defaultTo(knex.fn.now());
        table.integer('cd_event').notNullable();

        /* FOREIGN KEY */
        table.foreign('cd_event')
            .references('cd_event')
            .inTable('tb_event');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_link_mercado_pago');
}