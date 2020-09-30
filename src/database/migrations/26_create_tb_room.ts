import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_room', table => {
        table.increments('cd_room').primary();
        table.string('nm_room', 150).notNullable();

        table.integer('cd_event').notNullable();
        table.integer('cd_user').notNullable();

        /* FOREIGN KEY */
        table.foreign('cd_event')
            .references('cd_event')
                .inTable('tb_event');

        table.foreign('cd_user')
            .references('cd_user')
                .inTable('tb_user');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_room');
}