import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_purchase', table => {
        table.increments('cd_purchase').primary();
        table.timestamp('dt_purchase').defaultTo(knex.fn.now());
        table.string('cd_status', 12);
        table.integer('cd_user').notNullable();
        table.integer('cd_purchase_mercado_pago');
        table.integer('cd_purchase_billet');
        table.integer('cd_purchase_credit_card');

        /* FOREIGN KEYS */
        table.foreign('cd_status')
            .references('cd_status')
            .inTable('tb_status_purchase');

        table.foreign('cd_user')
            .references('cd_user')
            .inTable('tb_user');

        table.foreign('cd_purchase_billet')
            .references('cd_purchase_billet')
            .inTable('tb_purchase_billet');

        table.foreign('cd_purchase_credit_card')
            .references('cd_purchase_credit_card')
            .inTable('tb_purchase_credit_card');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_purchase');
}