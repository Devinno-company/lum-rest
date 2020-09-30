import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('tb_location_event', table => {
        table.increments('cd_location_event').primary();
        table.string('nm_street', 120).notNullable();
        table.string('nm_neighborhood', 100).notNullable();
        table.integer('cd_number').notNullable();
        table.string('cd_cep', 8).notNullable();
        table.string('nm_complement', 50);

        table.integer('cd_geolocation').notNullable();
        table.integer('cd_city').notNullable();
        
        /* FOREIGN KEYS */
        table.foreign('cd_geolocation')
            .references('cd_geolocation')
                .inTable('tb_geolocation');
        
        table.foreign('cd_city')
            .references('cd_city')
                .inTable('tb_city');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('tb_location_user');
}