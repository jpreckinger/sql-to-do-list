console.log('JS');
$(document).ready(onReady);

//let taskId; //setting this up to be used variously in functions

function onReady() {
    console.log('JQ sourced');
    $('#addNewTask').on('click', addNewTask);
    $('.table').on('click', '.deleteBtn', deleteTask);
    getTaskList();
}

// GET call to get database info and append to the DOM
function getTaskList () {
    $('#taskList').empty();
    $.ajax({
        method: 'GET',
        url: '/tasks'
    }).then(function(response) {
        console.log('Received task list from database');
        for( let task of response){
            let taskRow = $(`
                <tr>
                    <td class="taskName">${task.task}</td>
                    <td class="completionTime">${task.time_to_complete}</td>
                    <td class="compStatus">${task.completion_status}<button class=completeBtn>Done!</button></td>
                    <td class="notes">${task.notes}</td>
                    <td class="actions"><button class="deleteBtn">Delete?</button>
                        <button class="editBtn">Change it!</button></td>
                </tr>
            `)
            taskRow.data('id', task.id);
            $('#taskList').append(taskRow);
        }
    }).catch(function(error) {
        console.log('Error getting task list from database:', error);
    })
} // end getTaskList

// POST call to take input values from DOM and add to the database
function addNewTask() {
    event.preventDefault();
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
        $('input').val('');
        console.log('Sent new task to server', response);
        getTaskList();
    })
} // end addNewTask

function deleteTask() {
    taskId = $(this).closest('tr').data('id');
    console.log('delete clicked', taskId);
    $.ajax({
        method: 'DELETE',
        url: `/tasks/${taskId}`
    }).then(function(response) {
        console.log('Task deleted', response);
        getTaskList();
    }).catch(function(error) {
        alert('error deleting task', error);
    })
}
