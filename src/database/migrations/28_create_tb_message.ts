import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_message', table => {
        table.increments('cd_message').primary();
        table.string('ds_message', 255).notNullable();
        table.timestamp('hr_sended').notNullable().defaultTo(knex.fn.now());

        table.integer('cd_room').notNullable();
        table.integer('cd_user');
        table.integer('cd_event');

        /* FOREIGN KEY */
        table.foreign('cd_room')
            .references('cd_room')
            .inTable('tb_room');

        table.foreign('cd_user')
            .references('cd_user')
            .inTable('tb_user');

        table.foreign('cd_event')
            .references('cd_event')
            .inTable('tb_event');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_message');
}