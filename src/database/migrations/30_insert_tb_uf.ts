import Knex from 'knex';
import ufs from '../../utils/ufsBrazil';

export function up(knex: Knex) {
    return knex.insert(ufs).into('tb_uf');
}

export function down(knex: Knex) {
    return knex.delete().from('tb_uf');
}