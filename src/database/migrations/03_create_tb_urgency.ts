import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_urgency', table => {
        table.string('sg_urgency', 3).primary();
        table.string('nm_urgency', 100).notNullable();
        table.integer('qt_priority').notNullable();
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_urgency');
}