import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_notification_type', table => {
        table.string('sg_type', 3).primary();
        table.string('nm_type', 45).notNullable();
        table.string('ds_type', 255);
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_notification_type');
}