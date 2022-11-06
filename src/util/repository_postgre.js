const { Pool } = require('pg');
const keys = require('./keys');
const url = require('url');
const params = url.parse(keys.DB);
const auth = params.auth.split(':');

const pool = new Pool({
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
});

module.exports = pool;
