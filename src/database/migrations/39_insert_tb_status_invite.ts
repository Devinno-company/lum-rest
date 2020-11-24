import Knex from 'knex';

export function up(knex: Knex) {
    const status = [
        {sg_status: 'ACE', nm_status: 'Aceito', ds_status: 'Convite aceito.'},
        {sg_status: 'REC', nm_status: 'Recusado', ds_status: 'Convite recusado.'},
        {sg_status: 'PEN', nm_status: 'Pendente', ds_status: 'Convite aguarda resposta.'}
    ];

    return knex.insert(status).into('tb_status_invite');
}

export function down(knex: Knex) {
    return knex.delete().from('tb_status_invite');
}