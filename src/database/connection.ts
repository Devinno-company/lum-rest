import knex from 'knex';
const pg = require('pg');
const { production } = require('../../knexfile');

pg.defaults.ssl=true;
const db = knex({
    client: 'pg',
    connection: production.connection,
});

export default db;