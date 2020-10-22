import Knex from 'knex';

export function up(knex: Knex) {
    const role = [
        {sg_role: 'CRI', nm_role: 'Criador', ds_role: 'Responsável pela criação e toda organização do evento.'},
        {sg_role: 'COO', nm_role: 'Coordenador', ds_role: 'Responsável por auxiliar o criador a organizar o evento.'},
        {sg_role: 'EQP', nm_role: 'Membro da equipe', ds_role: 'Responsável por realizar as tarefas atribuídas a ele.'}
    ];

    return knex.insert(role).into('tb_role');
}

export function down(knex: Knex) {
    return knex.delete().from('tb_role');
}