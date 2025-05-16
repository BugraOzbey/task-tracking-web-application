export class AddTaskCommand {
    constructor(taskManager, task, observable) {
      this.taskManager = taskManager;
      this.task = task;
      this.observable = observable;
    }
  
    execute() {
      this.taskManager.addTask(this.task);
      this.observable.notify(this.taskManager.getTasks());
    }
  }
  