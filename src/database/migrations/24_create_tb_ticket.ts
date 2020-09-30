import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_ticket', table => {
        table.increments('cd_ticket').primary();
        table.string('nm_ticket', 100).notNullable();
        table.string('ds_ticket', 255).notNullable();
        table.decimal('vl_ticket', 9, 2).notNullable();
        table.integer('qt_ticket').notNullable();
        table.integer('qt_ticket_available').notNullable();

        table.integer('cd_event').notNullable();

        /* FOREIGN KEY */
        table.foreign('cd_event')
            .references('cd_event')
                .inTable('tb_event');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_ticket');
}