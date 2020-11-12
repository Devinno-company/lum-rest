import knex from 'knex';
const { production } = require('../../knexfile');
const pg = require('pg');
pg.defaults.ssl = true;
const db = knex({
    client: 'pg',
    connection: production.connection
});

export default db;