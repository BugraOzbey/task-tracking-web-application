import taskManager from "./singleton.js";
import { taskObservable } from "./observer.js";
import { strategies, filters } from "./strategy.js";
import { AddTaskCommand } from "./command.js";

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const sortSelect = document.getElementById("sortSelect");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");

// İstatistik DOM elemanları
const totalTasksElem = document.getElementById("totalTasks");
const completedTasksElem = document.getElementById("completedTasks");
const pendingTasksElem = document.getElementById("pendingTasks");

// Sayfa yüklendiğinde görevleri göster
document.addEventListener("DOMContentLoaded", () => {
  taskObservable.notify(taskManager.getTasks());
});

taskForm.addEventListener("submit", e => {
  e.preventDefault();
  const title = document.getElementById("taskTitle").value;
  const date = document.getElementById("taskDate").value;
  const category = document.getElementById("taskCategory").value;
  const priority = document.getElementById("taskPriority").value;
  
  const task = { 
    title, 
    date,
    category,
    priority
  };

  const command = new AddTaskCommand(taskManager, task, taskObservable);
  command.execute();

  taskForm.reset();
  document.getElementById("taskCategory").value = "genel";
  document.getElementById("taskPriority").value = "normal";
});

sortSelect.addEventListener("change", () => {
  taskObservable.notify(taskManager.getTasks());
});

categoryFilter.addEventListener("change", () => {
  taskObservable.notify(taskManager.getTasks());
});

statusFilter.addEventListener("change", () => {
  taskObservable.notify(taskManager.getTasks());
});

taskObservable.subscribe(renderTaskList);

document.getElementById("clearAllBtn").addEventListener("click", () => {
  if (confirm("Tüm görevleri silmek istediğinize emin misiniz?")) {
    taskManager.clearAllTasks();
    taskObservable.notify(taskManager.getTasks());
  }
});

function updateTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  
  totalTasksElem.textContent = `Toplam: ${total}`;
  completedTasksElem.textContent = `Tamamlanan: ${completed}`;
  pendingTasksElem.textContent = `Bekleyen: ${pending}`;
}

function renderTaskList(tasks) {
  let filteredTasks = [...tasks];
  
  const categoryValue = categoryFilter.value;
  filteredTasks = filters.category(filteredTasks, categoryValue);
  
  const statusValue = statusFilter.value;
  filteredTasks = filters.status(filteredTasks, statusValue);
  
  const strategy = strategies[sortSelect.value] || (x => x);
  const sorted = strategy([...filteredTasks]);
  
  updateTaskStats(tasks);

  taskList.innerHTML = "";
  
  sorted.forEach(task => {
    const li = document.createElement("li");
    li.classList.add(`category-${task.category || 'genel'}`);
    li.classList.add(`priority-${task.priority || 'normal'}`);
    
    const taskContent = document.createElement("div");
    taskContent.classList.add("task-content");
    
    const taskTitle = document.createElement("div");
    taskTitle.classList.add("task-title");
    taskTitle.style.textDecoration = task.completed ? 'line-through' : 'none';
    taskTitle.textContent = task.title;
    
    const taskDetails = document.createElement("div");
    taskDetails.classList.add("task-details");
    
    const dateSpan = document.createElement("span");
    dateSpan.textContent = `📅 ${task.date}`;
    
    const categorySpan = document.createElement("span");
    categorySpan.classList.add("task-category");
    categorySpan.textContent = task.category || 'genel';
    
    const prioritySpan = document.createElement("span");
    prioritySpan.classList.add("task-priority", task.priority || 'normal');
    
    let priorityEmoji = '';
    if (task.priority === 'yüksek') priorityEmoji = '🔴';
    else if (task.priority === 'normal') priorityEmoji = '🟡';
    else if (task.priority === 'düşük') priorityEmoji = '🔵';
    
    prioritySpan.textContent = `${priorityEmoji} ${task.priority || 'normal'}`;
    
    taskDetails.appendChild(dateSpan);
    taskDetails.appendChild(categorySpan);
    taskDetails.appendChild(prioritySpan);
    
    taskContent.appendChild(taskTitle);
    taskContent.appendChild(taskDetails);
    
    const taskActions = document.createElement("div");
    taskActions.classList.add("task-actions");
    
    const completeBtn = document.createElement("button");
    completeBtn.classList.add("complete-btn");
    completeBtn.textContent = task.completed ? "↩️" : "✔️";
    completeBtn.title = task.completed ? "Geri Al" : "Tamamla";

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "🗑️";
    deleteBtn.title = "Sil";

    completeBtn.addEventListener("click", () => {
      taskManager.toggleComplete(task);
      taskObservable.notify(taskManager.getTasks());
    });

    deleteBtn.addEventListener("click", () => {
      taskManager.removeTask(task);
      taskObservable.notify(taskManager.getTasks());
    });

    taskActions.appendChild(completeBtn);
    taskActions.appendChild(deleteBtn);
    
    li.appendChild(taskContent);
    li.appendChild(taskActions);

    taskList.appendChild(li);
  });
  
  if (sorted.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.style.textAlign = "center";
    emptyMessage.style.padding = "20px";
    emptyMessage.style.color = "#888";
    
    if (tasks.length === 0) {
      emptyMessage.textContent = "Henüz görev eklenmemiş.";
    } else {
      emptyMessage.textContent = "Filtrelere uygun görev bulunamadı.";
    }
    
    taskList.appendChild(emptyMessage);
  }
}