const development = {
    client: 'sqlite3',
    version: null,
    connection: {
        filename: './dev.sqlite3'
    }
};

const production = {
    client: 'pg',
    version: null,
    connection: {
        host: 'example.com',
        port: '5432',
        user: 'your_database_user',
        password: 'your_database_password',
        database: 'your_database_name'
    }
};

const config = {
    development,
    production,
    // Add more environments as needed
};

export default config;

