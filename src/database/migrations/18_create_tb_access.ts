import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_access', table => {
        table.increments('cd_access').primary();

        table.integer('cd_user').notNullable();
        table.integer('cd_event').notNullable();
        table.string('sg_role', 3).notNullable();

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
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_access');
}