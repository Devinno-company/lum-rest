import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_purchase_credit_card', table => {
        table.increments('cd_purchase_credit_card').primary();
        table.string('cd_payment_method').notNullable();
        table.date('dt_approved');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_purchase_credit_card');
}