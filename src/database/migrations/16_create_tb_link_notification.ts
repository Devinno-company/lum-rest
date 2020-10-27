import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_link_notification', table => {
        table.increments('cd_link').primary();
        table.integer('cd_item').notNullable();
        
        table.string('sg_type', 3).notNullable();
        
        /* FOREIGN KEY */
        table.foreign('sg_type')
            .references('sg_type')
                .inTable('tb_notification_type');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_link_notification');
}