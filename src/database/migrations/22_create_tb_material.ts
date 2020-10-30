import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_material', table => {
        table.increments('cd_material').primary();
        table.string('nm_material', 100).notNullable();
        table.integer('qt_material').notNullable();
        table.integer('qt_acquired').notNullable();
        table.string('ds_observation', 255);

        table.integer('cd_event').notNullable();
        table.string('sg_status', 3).notNullable();

        /* FOREIGN KEYS */
        table.foreign('cd_event')
            .references('cd_event')
                .inTable('tb_event');
        
        table.foreign('sg_status')
            .references('sg_status')
                .inTable('tb_status_material');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_material');
}