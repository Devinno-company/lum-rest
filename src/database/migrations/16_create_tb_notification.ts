import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_notification', table => {
        table.increments('cd_notification').primary();
        table.string('nm_title', 100).notNullable();
        table.string('ds_content', 255).notNullable();

        table.integer('cd_user').notNullable();

        /* FOREIGN KEY */
        table.foreign('cd_user')
            .references('cd_user')
                .inTable('tb_user');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_notification');
}