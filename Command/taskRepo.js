/*
    This is command pattern, mainly to record the commands or operations that has been carried out

    So we have a repo object, we have tasks as an object with key value pair (make it easier to find tasks) and also commands which is in array that contains objects

    We add/execute tasks from repo, then we will store the task name and data in command array
    then, if the property exists, we call the function which is 'save' in this case

    Replay to carry out all previous command in case of data loss
*/

let repo = {
    tasks: {},
    commands: [],
    get: function(id) {
        console.log('Getting task ' + id);

        return {
            name: 'New task from db'
        };
    },
    save: function(task) {
        repo.tasks[task.id] = task;
        console.log('Saving ' + task.name + ' to the db');
    },
    replay: function() {
        for (let i = 0; i < this.commands.length; i++) {
            let command = this.commands[i];
            this.executeNoLog(command.name, command.obj)
        }
    }
};

repo.executeNoLog = function(name) {
    let args = Array.prototype.slice.call(arguments, 1);

    if (repo[name])
        return repo[name].apply(repo, args);
}

repo.execute = function(name) {
    let args = Array.prototype.slice.call(arguments, 1);

    repo.commands.push({
        name,
        obj: args[0],
    });

    if (repo[name]) {
        return repo[name].apply(repo, args);
    }

    return false;
}
 
repo.execute('save', {
    id: 1,
    name: 'Task 1',
    completed: false
});

repo.execute('save', {
    id: 2,
    name: 'Task 2',
    completed: false
});

repo.execute('save', {
    id: 3,
    name: 'Task 3',
    completed: false
});

repo.execute('save', {
    id: 4,
    name: 'Task 4',
    completed: false
});

console.log(repo.tasks);

repo.tasks = {};

console.log(repo.tasks);

repo.replay();
console.log(repo.tasks);