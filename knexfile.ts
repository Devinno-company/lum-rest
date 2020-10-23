import path from 'path';

module.exports = {
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: path.resolve(__dirname, 'src', 'database', 'migrations')
        },
    },
    development: {
        client: 'pg',
        connection: {
            host: 'localhost',
            port: '5432',
            user: 'postgres',
            password: 'joaobanco',
            database: 'db_lum'
        }
    /*
   development: {
    client: 'pg',
    connection: {
        host: 'localhost',
        port: '4444',
        user: 'postgres',
        database: 'postgres'
    },

        migrations: {
            directory: path.resolve(__dirname, 'src', 'database', 'migrations')
        }
        */
    }
}