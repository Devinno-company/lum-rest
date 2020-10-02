import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_user', table => {
        table.increments('cd_user').primary();
        table.string('nm_user', 100).notNullable();
        table.string('nm_surname_user', 100).notNullable();
        table.string('ds_biography', 255);
        table.string('nm_label', 30);
        table.string('im_user', 255);
        table.string('nm_profission', 100);
        table.string('nm_company', 100);
        table.string('ds_website', 255);

        table.integer('cd_login').notNullable();
        table.integer('cd_location_user');

        /* FOREIGN KEYS */
        table.foreign('cd_login')
            .references('cd_login')
                .inTable('tb_login');

        table.foreign('cd_location_user')
            .references('cd_location_user')
                .inTable('tb_location_user');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_user');
}