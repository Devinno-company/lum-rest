import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_purchase_billet', table => {
        table.increments('cd_purchase_billet').primary();
        table.string('im_billet').notNullable();
        table.date('dt_expiration').notNullable();
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_purchase_billet');
}