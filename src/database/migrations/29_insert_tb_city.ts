import Knex from 'knex';
import cities from './../../utils/citiesBrazil';

export function up(knex: Knex) {
    return knex.insert(cities).into('tb_city');
}

export function down(knex: Knex) {
    return knex.delete().from('tb_city');
}