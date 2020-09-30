import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_event', table => {
        table.increments('cd_event').primary();
        table.string('nm_event', 100).notNullable();
        table.date('dt_start').notNullable();
        table.date('dt_end').notNullable();
        table.string('ds_event', 255);
        table.time('hr_start');
        table.time('hr_end');
        table.string('nm_type', 100);
        table.string('im_banner', 255);

        table.integer('cd_location_event').notNullable();
        table.string('sg_privacy', 3).notNullable();
        table.string('sg_category', 3).notNullable();

        /* FOREIGN KEYS */
        table.foreign('cd_location_event')
            .references('cd_location_event')
                .inTable('tb_location_event');

        table.foreign('sg_privacy')
            .references('sg_privacy')
                .inTable('tb_privacy');

        table.foreign('sg_category')
            .references('sg_category')
                .inTable('tb_category');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_event');
}