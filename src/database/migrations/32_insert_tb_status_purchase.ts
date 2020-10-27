import Knex from 'knex';

export function up(knex: Knex) {
    const status = [
        {sg_status: 'CON', nm_status: 'Aguardando pagamento', ds_status: 'Esta compra aguarda pagamento.'}, //1
        {sg_status: 'DIS', nm_status: 'Em disputa', ds_status: 'Esta compra está em disputa.'}, // 5
        {sg_status: 'PAG', nm_status: 'Paga', ds_status: 'Esta compra foi paga.'}, // 3
        {sg_status: 'BLO', nm_status: 'Bloqueada', ds_status: 'Esta compra está bloqueada.'}, // 12
        {sg_status: 'ANA', nm_status: 'Em análise', ds_status: 'Esta compra está em análise.'}, // 2
        {sg_status: 'DPN', nm_status: 'Disponível', ds_status: 'Esta compra está disponível.'}, // 4
    ];

    return knex.insert(status).into('tb_status_purchase');
}

export function down(knex: Knex) {
    return knex.delete().from('tb_status_purchase');
}