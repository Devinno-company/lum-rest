import Knex from 'knex';

export function up(knex: Knex) {
    const urgencies = [
        { sg_urgency: 'URG', nm_urgency: 'Urgente', qt_priority: 3 },
        { sg_urgency: 'IMP', nm_urgency: 'Importante', qt_priority: 2 },
        { sg_urgency: 'REL', nm_urgency: 'Relevante', qt_priority: 1 }
    ];

    return knex.insert(urgencies)
        .into('tb_urgency');
}

export function down(knex: Knex) {
    return knex.delete().from('tb_urgency');
}