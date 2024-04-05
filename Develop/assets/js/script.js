// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));


function readTasksFromStorage() {
    const storedProjects = JSON.parse(localStorage.getItem('tasks'));
  
    if(storedProjects !== null){
      return storedProjects;
    }
    const emptyProject = [];
    return emptyProject;
}

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const id = crypto.randomUUID();
    return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    // Crate a new taskCard element
    const taskCard = $('<div>');
    taskCard.attr('class', 'card project-card draggable my-3');
    taskCard.attr('data-project-id', task.id);
    //Create a new card header element 
    const cardHeader = $('<div>');
    cardHeader.attr('class', 'card-header h4')
    cardHeader.text(task.name);
    // Create a new card body element
    const cardBody = $('<div>');
    cardBody.attr('class', 'card-body');
    // Create a new paragraph element
    const cardType = $('<p>');
    cardType.attr('class', 'card-text');
    cardType.text(task.type);
    // Create a new paragraph element 
    const cardDate = $('<p>');
    cardDate.attr('class', 'card-text');
    cardDate.text(task.dueDate);
    // Create a new button element
    const cardBtn = $('<button>');
    cardBtn.attr('class', 'btn btn-danger delete');
    cardBtn.text("Delete");
    cardBtn.attr('data-project-id', task.id);
    cardBtn.on('click', handleDeleteTask);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const projects = readTasksFromStorage();

    // ? Empty existing project cards out of the lanes
    const todoList = $('#todo-cards');
    todoList.empty();
  
    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();
  
    const doneList = $('#done-cards');
    doneList.empty();
  
    // TODO: Loop through projects and create project cards for each status
    for (let project of projects) {
      if(project.status === "to-do"){
        todoList.append(createTaskCard(project));
      }else if(project.status === "in-progress"){
        inProgressList.append(createTaskCard(project));
      }else if(project.status === "done"){
        doneList.append(createTaskCard(project));
      }
    }
  
    // ? Use JQuery UI to make task cards draggable
    $('.draggable').draggable({
      opacity: 0.7,
      zIndex: 100,
      // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
      helper: function (e) {
        // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
        const original = $(e.target).hasClass('ui-draggable')
          ? $(e.target)
          : $(e.target).closest('.ui-draggable');
        // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
        return original.clone().css({
          width: original.outerWidth(),
        });
      },
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
 // ? Read projects from localStorage
 const projects = readTasksFromStorage();

 // ? Get the project id from the event
 const taskId = ui.draggable[0].dataset.projectId;

 // ? Get the id of the lane that the card was dropped into
 const newStatus = event.target.id;

 for (let project of projects) {
   // ? Find the project card by the `id` and update the project status.
   if (project.id === taskId) {
     project.status = newStatus;
   }
 }
 // ? Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
 localStorage.setItem('tasks', JSON.stringify(projects));
 renderTaskList();
}


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    //render the task list from storage
    renderTaskList();

    //add event listeners 

    //making lanes droppable
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
      });

    //making the due date field a date picker
    $('#taskDueDate').datepicker({
        changeMonth: true,
        changeYear: true,
      });
});
