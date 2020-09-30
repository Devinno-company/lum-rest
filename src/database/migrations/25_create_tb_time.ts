import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_time', table => {
        table.increments('cd_time').primary();
        table.string('nm_time', 100).notNullable();
        table.date('dt_time').notNullable();
        table.time('hr_start').notNullable();
        table.time('hr_end').notNullable();
        table.string('ds_time', 255);

        table.integer('cd_event').notNullable();

        /* FOREIGN KEY */
        table.foreign('cd_event')
            .references('cd_event')
                .inTable('tb_event');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_time');
}