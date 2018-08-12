/*
    Program flow

    We create 3 services to become an observer
    Initialize it
    ObserversList are to store observers (in the form of functions)
    We override the original save function in the task.js
    Then we call notify and set the context to the Observable task
    Then the observable task array will be looped and execute the observer functions with 'this' which is the ObservableTask
*/

let Task = require('./task');

let notificationService = function() {
    let message = 'Notifying: ';

    this.update = function(task) {
        console.log(message + task.user + ' for task ' + task.name);
    }
}

let loggingService = function() {
    let message = 'Logging: ';

    this.update = function(task) {
        console.log(message + task.user + ' for task ' + task.name);
    }
}

let auditingService = function() {
    let message = 'Auditing: ';

    this.update = function(task) {
        console.log(message + task.user + ' for task ' + task.name);
    }
}

function ObserverList() {
    this.observerList = [];
}

ObserverList.prototype.add = function(obj) {
    return this.observerList.push(obj);
}

ObserverList.prototype.get = function(index) {
    if (index > -1 && index < this.observerList.length) {
        return this.observerList[index];
    }
}

ObserverList.prototype.count = function() {
    return this.observerList.length;
}

let ObservableTask = function(data) {
    Task.call(this,data);

    this.observers = new ObserverList();
}

ObservableTask.prototype.addObserver = function(observer) {
    this.observers.add(observer);
}

ObservableTask.prototype.notify = function(context) {
    let observerCount = this.observers.count();

    for (let i = 0; i < observerCount; i++) {
        this.observers.get(i)(context);
    }
}

ObservableTask.prototype.save = function() {
    this.notify(this);
    Task.prototype.save.call(this);
}

let task1 = new ObservableTask({name: 'Created a demo for constructors', user: 'Jon'});

let not = new notificationService();
let ls = new loggingService();
let audit = new auditingService();

task1.addObserver(not.update);
task1.addObserver(ls.update);
task1.addObserver(audit.update);

task1.save();

