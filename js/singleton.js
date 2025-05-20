class TaskManager {
  constructor() {
    if (TaskManager.instance) return TaskManager.instance;
    
    const savedTasks = localStorage.getItem('tasks');
    this.tasks = savedTasks ? JSON.parse(savedTasks) : [];
    
    TaskManager.instance = this;
  }

  _saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  addTask(task) {
    task.id = Date.now().toString();
    task.completed = false;
    
    this.tasks.push(task);
    this._saveTasks();
  }

  getTasks() {
    return this.tasks;
  }

  removeTask(task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this._saveTasks();
  }

  toggleComplete(task) {
    const foundTask = this.tasks.find(t => t.id === task.id);
    if (foundTask) {
      foundTask.completed = !foundTask.completed;
      this._saveTasks();
    }
  }
  
  clearAllTasks() {
    this.tasks = [];
    localStorage.removeItem('tasks');
  }
}

const taskManager = new TaskManager();
export default taskManager;