console.log('JS');
$(document).ready(onReady);

//let taskId; //setting this up to be used variously in functions

function onReady() {
    console.log('JQ sourced');
    $('#addNewTask').on('click', addNewTask);
    $('.table').on('click', '.deleteBtn', addAlert);
    $('.table').on('click', '.editBtn', editTask);
    $('.table').on('click', '.submitBtn', submitUpdates);
    $('.dropdown-toggle').dropdown(); 
    $('.table').on('click', '.dropdown-item', changeStatus);     
    getTaskList();
}

// GET call to get database info and append to the DOM
function getTaskList () {
    $('#taskList').empty();
    $('#completedTaskList').empty();
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
                    <td class="compStatus">
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        ${task.completion_status}
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                            <button class="dropdown-item" type="button">Not yet...</button>
                            <button class="dropdown-item" type="button">Working on it.</button>
                            <button class="dropdown-item" type="button">All done!</button>
                        </div>
                    </div>    
                    </td>
                    <td class="notes">${task.notes}</td>
                    <td class="actions"><button class="deleteBtn btn btn-warning">Delete?</button>
                        <button class="editBtn btn btn-info">Change it!</button></td>
                </tr>
            `)
            taskRow.data('id', task.id);
            if(task.completion_status === 'Not yet...') {
                $(taskRow).removeClass("table-success");
                $(taskRow).removeClass("table-primary");
                $('#taskList').append(taskRow);
            } else if (task.completion_status === 'Working on it.' ) {
                $(taskRow).removeClass("table-success");
                $(taskRow).addClass("table-primary");
                $('#taskList').append(taskRow);
            } else {
                $(taskRow).removeClass("table-primary");
                $(taskRow).addClass("table-success");
                $('#completedTaskList').append(taskRow);
            }
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
            status: 'Not yet...',
            notes: notesIn
        }
    }).then(function(response) {
        $('input').val('');
        console.log('Sent new task to server', response);
        getTaskList();
    })
} // end addNewTask

// DELETE call to remove task from list
function deleteTask(taskId) {
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

function addAlert() {
    taskId = $(this).closest('tr').data('id');
    console.log('in sweetalert');
    swal({
        title: "Are you sure you want to give up on this?",
        text: "Once deleted, you will not be able to recover this task! At least, until you type it in again",
        icon: "warning",
        buttons: ['Hold up tho', 'I am a quitter'],
        dangerMode: true,
    })
    .then(function (willDelete) {
        if (willDelete) {
            swal("Nice! You gave up on something", {
                icon: "success"
            });
            deleteTask(taskId);
        } else {
            swal("You decided not to be a quitter. Nice.");
        }
    });
}; //end delete listener


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
            <td class="compStatus"></td>
            <td><input class="notesEdit" value="${notesEdit}" type="text"></td>
            <td><button class="submitBtn btn btn-danger">Comfirm these changes!</button></td>
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

//function to update status using the dropdown button
function changeStatus() {
    taskId = $(this).closest('tr').data('id');
    console.log('Clicked in menu');
    let newStatus = $(this).text();
    console.log(newStatus);
    $.ajax({
        method: 'PUT',
        url: `/tasks/status/${taskId}`,
        data: {
            status: newStatus
        }
    }).then(function (response) {
        console.log('success sending status', response);
        getTaskList();
    }).catch(function(response) {
        console.log('error sending status', error);
    })
}
