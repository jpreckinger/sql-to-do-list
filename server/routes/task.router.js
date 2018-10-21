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

// GET route

taskRouter.get('/', (req, res) => {
    const sqlText = `SELECT * FROM tasks ORDER BY id;`;
    pool.query(sqlText)
    .then((result) => {
        console.log(`succesful database query ${sqlText}`);
        res.send(result.rows);
    })
    .catch((error) => {
        console.log(`error making database query ${sqlText}`, error);
        res.sendStatus(500);
    })
})

// POST route

taskRouter.post('/', (req, res)=> {
    newTask = req.body;
    const sqlText = `INSERT INTO tasks (task, time_to_complete, completion_status, notes)
                     VALUES ($1, $2, $3, $4);`;
    pool.query(sqlText, [newTask.task, newTask.time, newTask.status, newTask.notes])
    .then((result) => {
        console.log('Added task to database', newTask);
        res.sendStatus(200);
    })
    .catch((error) => {
        console.log('error adding task to database', newTask);
        res.sendStatus(500);
    })
})

// DELETE route
taskRouter.delete('/:id', (req, res) => {
    let taskId = req.params.id;
    const sqlText = `DELETE FROM tasks WHERE id = $1;`
    pool.query(sqlText, [taskId])
    .then((result) => {
        res.sendStatus(200); //gotta send that response
    })
    .catch((error) => {
        res.sendStatus(500); //cause we write well-behaved servers
    })
})

module.exports = taskRouter;
