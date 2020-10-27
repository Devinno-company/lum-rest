import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_notification', table => {
        table.increments('cd_notification').primary();
        table.string('nm_title', 100).notNullable();
        table.string('ds_content', 255);
        table.boolean('cd_read').notNullable().defaultTo('false');
        
        table.integer('cd_user').notNullable();
        table.integer('cd_link').notNullable();
        

        /* FOREIGN KEY */
        table.foreign('cd_user')
            .references('cd_user')
                .inTable('tb_user');

        table.foreign('cd_link')
            .references('cd_link')
                .inTable('tb_link_notification');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_notification');
}