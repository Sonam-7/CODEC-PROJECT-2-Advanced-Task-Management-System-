$(document).ready(function () {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const renderTasks = () => {
    $(".task-list").empty();
    tasks.forEach((task) => {
      const taskCard = `
        <div class="task-card" data-id="${task.id}">
          <h6>${task.title}</h6>
          <p class="small mb-1">${task.description || ""}</p>
          <p class="small text-muted mb-1">👤 ${task.assignee || "Unassigned"}</p>
          <p class="small text-muted">📅 ${task.dueDate || "No date"}</p>
          <div class="task-actions">
            <i class="bi bi-pencil-square edit-task"></i>
            <i class="bi bi-trash delete-task"></i>
          </div>
        </div>`;
      $(`.task-list[data-status='${task.status}']`).append(taskCard);
    });
    updateProgress();
    renderCalendar();
  };

  const updateProgress = () => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    $("#progressBar").css("width", `${percent}%`).text(`${percent}%`);
  };

  $("#taskForm").submit(function (e) {
    e.preventDefault();
    const id = $("#taskId").val();
    const newTask = {
      id: id || Date.now(),
      title: $("#title").val(),
      description: $("#description").val(),
      assignee: $("#assignee").val(),
      dueDate: $("#dueDate").val(),
      status: $("#status").val(),
    };

    if (id) {
      tasks = tasks.map((t) => (t.id == id ? newTask : t));
    } else {
      tasks.push(newTask);
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
    $("#taskModal").modal("hide");
    $("#taskForm")[0].reset();
    renderTasks();
  });

  $(document).on("click", ".delete-task", function () {
    const id = $(this).closest(".task-card").data("id");
    tasks = tasks.filter((t) => t.id != id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  });

  $(document).on("click", ".edit-task", function () {
    const id = $(this).closest(".task-card").data("id");
    const task = tasks.find((t) => t.id == id);
    $("#taskId").val(task.id);
    $("#title").val(task.title);
    $("#description").val(task.description);
    $("#assignee").val(task.assignee);
    $("#dueDate").val(task.dueDate);
    $("#status").val(task.status);
    $("#taskModal").modal("show");
  });

  // Initialize Calendar
  const renderCalendar = () => {
    const calendarEl = document.getElementById("calendar");
    const events = tasks
      .filter((t) => t.dueDate)
      .map((t) => ({
        title: t.title,
        start: t.dueDate,
        color: t.status === "done" ? "#28a745" : "#ffc107",
      }));

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      events: events,
    });
    calendar.render();
  };

  renderTasks();
});
