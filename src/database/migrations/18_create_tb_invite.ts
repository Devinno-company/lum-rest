import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_invite', table => {
        table.increments('cd_invite').primary();
        table.string('nm_title').notNullable();
        table.string('ds_content').notNullable();

        table.integer('cd_user').notNullable();
        table.integer('cd_access').notNullable();
        table.string('sg_status', 3).notNullable();

        /* FOREIGN KEYS */
        table.foreign('cd_user')
            .references('cd_user')
                .inTable('tb_user');
        
        table.foreign('cd_access')
            .references('cd_access')
                .inTable('tb_access');

        table.foreign('sg_status')
            .references('sg_status')
                .inTable('tb_status_invite');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_invite');
}