import knex from 'knex';
const { production } = require('../../knexfile');

const db = knex({
    client: 'pg',
    connection: production.connection
});

export default db;