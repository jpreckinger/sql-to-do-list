// boilerplate setup for server file
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const taskRouter = require('./routes/task.router');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

//routes
//app.use('/tasks', taskRouter);


//Spinning up port
app.listen(PORT, () => {
    console.log('listening on port', PORT);
})