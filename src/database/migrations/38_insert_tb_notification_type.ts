import Knex from 'knex';

export function up(knex: Knex) {
    const notification_type = [
        { sg_type: 'CVC', nm_type: 'Convite de Coordenador', ds_type: 'Notificação de Convite para participar de um evento como coordenador.' },
        { sg_type: 'CVE', nm_type: 'Convite de Equipe', ds_type: 'Notificação de Convite para participar de um evento como um membro da equipe.' },
        { sg_type: 'AFE', nm_type: 'Atualização de função para membro da equipe', ds_type: 'Notificação de mudança de função para membro da equipe.' },
        { sg_type: 'AFC', nm_type: 'Atualização de função para coordenador', ds_type: 'Notificação de mudança de função para coordenador.' },
        { sg_type: 'MTM', nm_type: 'Material: Meta atingida', ds_type: 'Notificação de que um material teve sua meta atingida'},
        { sg_type: 'MTA', nm_type: 'Material Adicionado', ds_type: 'Notificação de que um novo material foi adicionado'},
        { sg_type: 'RET', nm_type: 'Removido de um evento', ds_type: 'Notificação de que o usuário doi removido de um evento'},
        { sg_type: 'MSE', nm_type: 'Nova mensagem de um evento', ds_type: 'O suporte de um evento te respondeu'},
        { sg_type: 'MSU', nm_type: 'Nova mensagem de um usuário', ds_type: 'Um usuário mandou mensagem para o evento'}
    ];

    return knex.insert(notification_type).into('tb_notification_type');
}

export function down(knex: Knex) {
    return knex.delete().from('tb_category');
}