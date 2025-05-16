class Observable {
    constructor() {
      this.observers = [];
    }
  
    subscribe(func) {
      this.observers.push(func);
    }
  
    notify(data) {
      this.observers.forEach(func => func(data));
    }
  }
  
  export const taskObservable = new Observable();
  