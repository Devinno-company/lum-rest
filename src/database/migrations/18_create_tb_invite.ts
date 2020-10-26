import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_invite', table => {
        table.increments('cd_invite').primary();
        table.string('nm_title').notNullable();
        table.string('ds_content').notNullable();

        table.integer('cd_user').notNullable();
        table.integer('cd_event').notNullable();
        table.string('sg_role', 3).notNullable();
        table.string('sg_status', 3).notNullable().defaultTo('PEN');

        /* FOREIGN KEYS */
        table.foreign('cd_user')
            .references('cd_user')
                .inTable('tb_user');
        
        table.foreign('cd_event')
            .references('cd_event')
                .inTable('tb_event');
        
        table.foreign('sg_role')
            .references('sg_role')
                .inTable('tb_role');

        table.foreign('sg_status')
            .references('sg_status')
                .inTable('tb_status_invite');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_invite');
}