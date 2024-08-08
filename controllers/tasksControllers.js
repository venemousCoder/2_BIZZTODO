const Tasks = require('../models/tasks');
const User = require('../models/user');
const cache = require('../utils/sessionCache');


function createTask(req, res, next) {
    const newTask = {
        title: req.body.title,
        user: req.user.id
    }
    Tasks.create(newTask)
        .then((createdTask) => {
            res.status(201).json({
                status: 'success',
                message: 'Task created',
                data: createdTask
            })
            req.session.tasks.push(createdTask);
            req.session.save((err) => {
                if (err) {
                    return res.status(500).json({
                        status: 'fail',
                        message: 'something went wrong while getting tasks.',
                        error: err
                    })
                }
            })
            return next()
        }).catch((err) => {
            return res.status(500).json({
                status: 'fail',
                message: 'Could not create request',
                error: err
            })
        });
}

function viewTasks(req, res, next) {
    if (!req.session.tasks) {
        Tasks.find({ user: req.user.id })
            .then((tasks) => {
                req.session.tasks = tasks;
                req.session.save((err) => {
                    if (err) {
                        return res.status(500).json({
                            status: 'fail',
                            message: 'something went wrong while getting tasks.',
                            error: err
                        })
                    }
                })
                res.status(200).json({
                    status: 'success',
                    message: '',
                    tasks: tasks
                })
                return next();
            }).catch((err) => {
                return res.status(500).json({
                    status: 'fail',
                    message: 'something went wrong while getting tasks.',
                    error: err
                })
            });
    } else {
        res.status(200).json({
            status: 'success',
            message: '',
            tasks: req.session.tasks
        })
        return next()
    }

}

function updateTask(req, res, next) {
    Tasks.findOneAndUpdate({ user: req.user.id, title: req.query.title }, { title: req.query.updateTitle, status: req.query.status }, { new: true })
        .then((updatedTask) => {
            if (!updatedTask) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'Please provide the title of the task to be updated and try again.'
                })
            }
            cache('update', updatedTask.id, updatedTask, req, res, next);
        }).catch((err) => {
            if (err) {
                return res.status(500).json({
                    status: 'fail',
                    message: 'something went wrong',
                    error: err
                })
            }
            return res.status(500).json({
                status: 'fail',
                message: 'failed to update task'
            })
        });
}

function deleteTask(req, res, next) {
    Tasks.findOneAndDelete({ user: req.user.id, title: req.query.title })
        .then((deletedTask) => {
            if (!deletedTask) {
                return res.status(401).json({
                    status: 'fail',
                    message: 'Please provide the title of the task to be updated and try again.'
                })
            }
            cache('delete', deletedTask.id, null, req, res, next);
        }).catch((err) => {
            return res.status(401).json({
                status: 'fail',
                message: 'failed to delete task',
                error: err
            })
        });
}

function filterTasks(req, res, next) {
    let title = req.body.title;
    let status = req.body.status;

    let page = req.query.page || 0;
    let tasksPerPage = req.query.tasksPerPage || 3;


    if (title && status) {
        let status = new RegExp(req.body.status, 'i');
        let title = new RegExp(req.body.title, 'i');
        //
        Tasks.find({ user: req.user.id, title: title, status: status })
            .skip(page * tasksPerPage)
            .limit(parseInt(tasksPerPage))
            .then((searchResults) => {
                res.status(200).json({
                   message: `Search result for "${title}"`,
                   results: searchResults
               });
               return next()
               console.log('hellop');
           })
           .catch((err) => {
               return res.status(500).json({
                   status: 'fail',
                   error: err,
                   message: 'could not search for task'
               });
               console.log('err');
           })
           return;
    }

    if (status) {
        let status = new RegExp(req.body.status, 'i');
        //
        Tasks.find({ user: req.user.id, status: status })
            .skip(page * tasksPerPage)
            .limit(parseInt(tasksPerPage))
    .then((searchResults) => {
        res.status(200).json({
           message: `Search result for "${title}"`,
           results: searchResults
       });
       return next()
       console.log('hellop');
   })
   .catch((err) => {
       return res.status(500).json({
           status: 'fail',
           error: err,
           message: 'could not search for task'
       });
       console.log('err');
   })
   return;
    }

    if (title) {
        let title = new RegExp(req.body.title, 'i');
        Tasks.find({ user: req.user.id, title: title })
            .skip(page * tasksPerPage)
            .limit(parseInt(tasksPerPage))
            .then((searchResults) => {
                 res.status(200).json({
                    message: `Search result for "${title}"`,
                    results: searchResults
                });
                return next()
                console.log('hellop');
            })
            .catch((err) => {
                return res.status(500).json({
                    status: 'fail',
                    error: err,
                    message: 'could not search for task'
                });
                console.log('err');
            })
            return;

    }

    Tasks.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .skip(page * tasksPerPage)
        .limit(parseInt(tasksPerPage))
        .then((searchResults) => {
            res.status(200).json({
               message: `Search result for "${title}"`,
               results: searchResults
           });
           return next()
           console.log('hellop');
       })
       .catch((err) => {
           return res.status(500).json({
               status: 'fail',
               error: err,
               message: 'could not search for task'
           });
           console.log('err');
       })
       return;
}


module.exports = { createTask, viewTasks, updateTask, deleteTask, filterTasks }