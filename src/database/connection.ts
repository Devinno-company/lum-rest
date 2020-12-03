import knex from 'knex';
import connection from '../../knexfile';


const pg = require('pg');
//pg.defaults.ssl=true;

const db = knex({
    client: 'pg',
    connection: connection.development.connection,
});

export default db;