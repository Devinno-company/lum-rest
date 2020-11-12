import Knex from 'knex';

export function up(knex: Knex) {
    const status = [
        {sg_status: 'ADQ', nm_status: 'Adquirido', ds_status: 'O material já foi obtido.'},
        {sg_status: 'PEN', nm_status: 'Pendente', ds_status: 'O material ainda não foi obtido.'}
    ];

    return knex.insert(status).into('tb_status_material');
}

export function down(knex: Knex) {
    return knex.delete().from('tb_status_material');
}