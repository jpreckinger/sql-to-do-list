console.log('JS');
$(document).ready(onReady);

function onReady() {
    console.log('JQ sourced');
    getTaskList();
}

function getTaskList () {
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