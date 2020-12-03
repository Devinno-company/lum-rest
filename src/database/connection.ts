import knex from 'knex';
import connection from '../../knexfile';


const pg = require('pg');
//pg.defaults.ssl=true;

const db = knex({
    client: 'pg',
    connection: connection.production.connection,
});

export default db;