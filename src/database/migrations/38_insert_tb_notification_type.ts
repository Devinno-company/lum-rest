import Knex from 'knex';

export function up(knex: Knex) {
    const notification_type = [
        { sg_type: 'CVC', nm_type: 'Convite de Coordenador', ds_type: 'Notificação de Convite para participar de um evento como Coordenador.' },
        { sg_type: 'CVE', nm_type: 'Convite de Equipe', ds_type: 'Notificação de Convite para participar de um evento como Equipe.' },
        { sg_type: 'MTM', nm_type: 'Material: Meta atingida', ds_type: 'Notificação de que um material teve sua meta atingida'},
        { sg_type: 'MTA', nm_type: 'Material Adicionado', ds_type: 'Notificação de que um novo material foi adicionado'}
    ];

    return knex.insert(notification_type).into('tb_notification_type');
}

export function down(knex: Knex) {
    return knex.delete().from('tb_category');
}