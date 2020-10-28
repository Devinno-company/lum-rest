import knex from 'knex';
const { connection } = require('../../knexfile');

const db = knex({
    client: 'pg',
    connection: connection.connection
});

export default db;