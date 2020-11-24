import Knex from 'knex';

export function up(knex: Knex) {
    const privacy = [
        {sg_privacy: 'PRI', nm_privacy: 'Privado', ds_privacy: 'Apenas colaboradores podem ver as informações deste este evento.'},
        {sg_privacy: 'PUB', nm_privacy: 'Público', ds_privacy: 'Qualquer usuário pode ver as informações deste evento.'}
    ];

    return knex.insert(privacy).into('tb_privacy');
}

export function down(knex: Knex) {
    return knex.delete().from('tb_privacy');
}