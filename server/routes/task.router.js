const express = require('express');
const taskRouter = express.Router();

//Connection to database
const pg = require('pg');
const url = require('url');

const Pool = pg.Pool;

let config = {};

if (process.env.DATABASE_URL ) {
    const params = url.parse(process.env.DATABASE_URL);
    const auth = params.auth.split(':');

    config = {
        user: auth[0],
        password: auth[1],
        host: params.hostname,
        port: params.port,
        database: params.pathname.split('/')[1],
        ssl: true,
        max: 10,
        idleTimeoutMillis: 30000
    }
}
else {
    config = {
        database: 'weekend-to-do-app',
        host: 'localhost',
        port: 5432,
        max: 10,
        idleTimeoutMillis: 30000
    }
}
const pool = new Pool(config);

pool.on('connect', () => {
   console.log('Connected to the database');
});

pool.on('error', () => {
   console.log('Error with database pool');
});