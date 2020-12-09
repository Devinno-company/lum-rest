import Knex from 'knex';

export function up(knex: Knex) {
    const category = [
        { sg_category: 'CSE', nm_category: 'Congresso, Seminário', ds_category: 'Eventos com esta categoria estão relacionados a congressos e seminários independente de qual seja.' },
        { sg_category: 'CWO', nm_category: 'Curso, Workshop', ds_category: 'Eventos com esta categoria estão relacionados a cursos e workshops independente de qual seja.'},
        { sg_category: 'ESP', nm_category: 'E-sports', ds_category: 'Eventos com esta categoria estão relacionados a e-sports independente de qual seja.'},
        { sg_category: 'ENE', nm_category: 'Encontro, Networking', ds_category: 'Eventos com esta categoria estão relacionados a encontros e networking independente de qual seja.'},
        { sg_category: 'EST', nm_category: 'Esportivo', ds_category: 'Eventos com esta categoria estão relacionados a esportes independente de qual seja.'},
        { sg_category: 'FEX', nm_category: 'Feira, Exposição', ds_category: 'Eventos com esta categoria estão relacionados a feiras e exposições independente de qual seja.'},
        { sg_category: 'FCT', nm_category: 'Filme, Cinema e Teatro', ds_category: 'Eventos com esta categoria estão relacionados a filmes, cinema e teatro independente de qual seja.'},
        { sg_category: 'GAS', nm_category: 'Gastronômico', ds_category: 'Eventos com esta categoria estão relacionados a gastronomia independente de qual seja.'},
        { sg_category: 'RES', nm_category: 'Religioso, Espiritual', ds_category: 'Eventos com esta categoria estão relacionados a religiões independente de qual seja.'},
        { sg_category: 'SMG', nm_category: 'Show, Música e Festa', ds_category: 'Eventos com esta categoria estão relacionados a shows, música e festas independente de qual seja.'},
        { sg_category: 'OUE', nm_category: 'Outro evento', ds_category: 'Eventos com esta categoria estão relacionados a outros tipos de eventos independente de qual seja.'}
    ];

    return knex.insert(category).into('tb_category');
}

export function down(knex: Knex) {
    return knex.delete().from('tb_category');
}