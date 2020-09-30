import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_map', table => {
        table.increments('cd_map').primary();
        table.string('im_map', 255).notNullable();
        table.string('ds_map', 255).notNullable();

        table.integer('cd_event').notNullable();
    
        /* FOREIGN KEY */
        table.foreign('cd_event')
            .references('cd_event')
                .inTable('tb_event');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_map');
}