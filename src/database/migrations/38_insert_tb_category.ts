import Knex from 'knex';

export function up(knex: Knex) {
    const category = [
        { sg_category: 'ESP', nm_category: 'Esportivo', ds_category: 'Eventos com esta categoria estão relacionados a esportes independente de qual seja.' },
        { sg_category: 'REL', nm_category: 'Religioso', ds_category: 'Eventos com esta categoria estão relacionados a religiões independente de qual seja.'}
    ];

    return knex.insert(category).into('tb_category');
}

export function down(knex: Knex) {
    return knex.delete().from('tb_category');
}