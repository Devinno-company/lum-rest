import path from 'path';

module.exports = {
    production: {
        client: 'pg',
        connection: "postgres://qkwhjhxbhpggns:882c9f0897a9b87cae4a4d651987f2a5593fe9a6db95ba00c41e3003ecf8e9ed@ec2-52-207-124-89.compute-1.amazonaws.com:5432/dir6l1g9ud2su",
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
        },
        migrations: {
            directory: path.resolve(__dirname, 'src', 'database', 'migrations')
        }
    }/*
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
    }*/
}