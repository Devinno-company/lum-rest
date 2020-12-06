import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_checkin', table => {
        table.increments('cd_checkin').primary();
        table.boolean('id_valid').notNullable();
        table.string('cd_qr_code', 255).notNullable();
        table.string('cd_token_qr', 300).notNullable();
        table.string('nm_buyer', 100);
        table.specificType('cd_cpf_buyer', 'char(11)');
        table.string('cd_phone_buyer', 12);

        table.integer('cd_purchase').notNullable();
        table.integer('cd_ticket').notNullable();

        /* FOREIGN KEYS */
        table.foreign('cd_purchase')
            .references('cd_purchase')
                .inTable('tb_purchase');

        table.foreign('cd_ticket')
            .references('cd_ticket')
                .inTable('tb_ticket');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_checkin');
}