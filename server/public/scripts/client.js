console.log('JS');
$(document).ready(onReady);

function onReady() {
    console.log('JQ sourced');
    $('#addNewTask').on('click', addNewTask);
    getTaskList();
}

function getTaskList () {
    $('#taskList').empty();
    $.ajax({
        method: 'GET',
        url: '/tasks'
    }).then(function(response) {
        console.log('Received task list from database');
        for( let task of response){
            $('#taskList').append(`
                <tr>
                    <td class="taskName">${task.task}</td>
                    <td class="completionTime">${task.time_to_complete}</td>
                    <td class="compStatus">${task.completion_status}</td>
                    <td class="compStatus">${task.notes}</td>
                </tr>
            `)
        }
    }).catch(function(error) {
        console.log('Error getting task list from database:', error);
    })
}

function addNewTask() {
    let taskIn = $('#task').val();
    let timeIn = $('#time').val();
    let notesIn = $('#notes').val();
    $.ajax({
        method: 'POST',
        url: '/tasks',
        data: {
            task: taskIn,
            time: timeIn,
            status: 'false',
            notes: notesIn
        }
    }).then(function(response) {
        console.log('Sent new task to server', response);
        getTaskList();
    })
}