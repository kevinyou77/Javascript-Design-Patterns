/*
    Program flow

    - Same logic as observer pattern, but with mediator, you actually have a middleman to do publish and subscribe

    - We have channels which we can populate with observers

    - Publish an operation if something happen (notify observers)
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

ObserverList.prototype.removeAt = function(index) {
    this.observerList.splice(index, 1);
}

ObserverList.prototype.indexOf = function(obj, startIndex) {
    let i = startIndex;

    while (i <  this.observerList[i].length) {
        if (obj === this.observerList[i])
            return i;

        i++;
    }

    return -1;
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

ObservableTask.prototype.removeObserver = function (obj) {
    this.observers.removeAt(this.observers.indexOf(obj, 0));
}

let mediator = (function(){
    let channels = {};
    
    let subscribe = function(channel, context, func) {
        if (!channels[channel])
            channels[channel] = [];

        mediator.channels[channel].push({
            context: context,
            func: func
        });
    };

    let publish = function(channel) {
        if (!this.channels[channel])
            return false;

        //remove the first argument (convert the arguments to an array)
        //call accepts argument list
        //arguments -> object we want to apply to
        let args = Array.prototype.slice.call(arguments, 1);

        for (let i = 0; i < channels[channel].length; i++) {
            let sub = mediator.channels[channel][i];
            //apply accepts single array of argument
            sub.func.apply(sub.context, args);
        }
    }

    return { channels, publish, subscribe };
}())

let task1 = new ObservableTask({name: 'Created a demo for constructors', user: 'Jon'});

let not = new notificationService();
let ls = new loggingService();
let audit = new auditingService();

mediator.subscribe('complete', not, not.update);
mediator.subscribe('complete', ls, ls.update);
mediator.subscribe('complete', audit, audit.update);

task1.complete = function() {
    mediator.publish('complete', this);
    Task.prototype.complete.call(this);
}

task1.complete();

