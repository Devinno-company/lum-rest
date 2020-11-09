import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_purchase', table => {
        table.increments('cd_purchase').primary();

        table.string('sg_status', 3).notNullable();
        table.integer('cd_user').notNullable()

        /* FOREIGN KEYS */
        table.foreign('sg_status')
            .references('sg_status')
                .inTable('tb_status_purchase');
        
        table.foreign('cd_user')
            .references('cd_user')
                .inTable('tb_user');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_purchase');
}