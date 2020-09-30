import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_uf', table => {
        table.string('sg_uf', 2).primary();
        table.string('nm_uf', 100).notNullable();

        table.integer('cd_country').notNullable();

        /* FOREIGN KEY */
        table.foreign('cd_country')
            .references('cd_country')
                .inTable('tb_country');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_uf');
}