import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_notice', table => {
        table.increments('cd_notice').primary();
        table.string('nm_notice', 100).notNullable();
        table.string('ds_notice', 255).notNullable();
        table.integer('qt_priority', 5).notNullable();

        table.integer('cd_event').notNullable();
        table.string('sg_urgency', 3).notNullable();

        /* FOREIGN KEYS */
        table.foreign('cd_event')
            .references('cd_event')
                .inTable('tb_event');
        
        table.foreign('sg_urgency')
            .references('sg_urgency')
                .inTable('tb_urgency');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_notice');
}