import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_city', table => {
        table.increments('cd_city').primary();
        table.string('nm_city', 100).notNullable();

        table.string('sg_uf', 2).notNullable();

        /* FOREIGN KEY */
        table.foreign('sg_uf')
            .references('sg_uf')
                .inTable('tb_uf');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_city');
}