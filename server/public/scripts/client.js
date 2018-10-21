console.log('JS');
$(document).ready(onReady);

//let taskId; //setting this up to be used variously in functions

function onReady() {
    console.log('JQ sourced');
    $('#addNewTask').on('click', addNewTask);
    $('.table').on('click', '.deleteBtn', deleteTask);
    $('.table').on('click', '.editBtn', editTask);
    $('.table').on('click', '.submitBtn', submitUpdates);
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

// DELETE call to remove task from list
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
} // end deleteTask

//function to append inputs for updating tasks
function editTask() {
    taskId = $(this).closest('tr').data('id');
    console.log(taskId);
    let targetRow = $(this).closest('tr');
    let taskNameEdit = $(this).closest('tr').find('.taskName').text();
    let completionTimeEdit = $(this).closest('tr').find('.completionTime').text();
    let completionStatus = $(this).closest('tr').find('.compStatus').text();
    let notesEdit = $(this).closest('tr').find('.notes').text();
    targetRow.after(`
    <tr>
        <form>
            <td><input class="taskNameEdit" value="${taskNameEdit}" type="text"></td>
            <td><input class="completionTimeEdit" value="${completionTimeEdit}" type="text"></td>
            <td class="compStatus">${completionStatus}</td>
            <td><input class="notesEdit" value="${notesEdit}" type="text"></td>
            <td><button class="submitBtn btn btn-secondary">Comfirm these changes!</button></td>
        </form>
    </tr>
    `);
} //end editTask

//PUT call to send updates to database
function submitUpdates() {
    event.preventDefault();
    let newTaskName = $(this).closest('tr').find('.taskNameEdit').val();
    let newCompletionTime = $(this).closest('tr').find('.completionTimeEdit').val();
    let newNotes= $(this).closest('tr').find('.notesEdit').val();
    $.ajax({
        method: 'PUT',
        url: `/tasks/${taskId}`,
        data: {
            taskName: newTaskName,
            completionTime: newCompletionTime,
            notes: newNotes
        }
    })
    .then(function(response) {
        getTaskList();
    })
    .catch(function(error){
        alert('error editting task')
    })
} // end submitUpdates