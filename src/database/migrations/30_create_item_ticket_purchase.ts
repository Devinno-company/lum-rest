import Knex from 'knex';

export function up(knex: Knex) {
    return knex.schema.createTable('item_ticket_purchase', table => {
        table.integer('qt_ticket_sell').notNullable();
        
        table.integer('cd_ticket').notNullable();
        table.integer('cd_purchase').notNullable();
        
        /* FOREIGN KEY */
        table.foreign('cd_ticket')
            .references('cd_ticket')
                .inTable('tb_ticket');
        
        table.foreign('cd_purchase')
            .references('cd_purchase')
                .inTable('tb_purchase');
    });
}

export function down(knex: Knex) {
    return knex.schema.dropTable('item_ticket_purchase');
}