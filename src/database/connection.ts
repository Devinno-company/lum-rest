import knex from 'knex';
const { development } = require('../../knexfile');

const db = knex({
    client: 'pg',
    connection: development.connection
});

export default db;