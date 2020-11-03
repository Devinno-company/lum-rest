import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_task', table => {
        table.increments('cd_task').primary();
        table.string('nm_task', 100).notNullable();
        table.string('ds_task', 255).notNullable();
        table.boolean('id_completed').defaultTo(false);

        table.integer('cd_event').notNullable();
        table.integer('cd_access_user');

        /* FOREIGN KEYS */
        table.foreign('cd_event')
            .references('cd_event')
                .inTable('tb_event');

        table.foreign('cd_access_user')
            .references('cd_access')
                .inTable('tb_access');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_task');
}