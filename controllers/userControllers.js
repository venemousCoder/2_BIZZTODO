const passport = require('passport');
const User = require('../models/user');
const Task = require('../models/tasks');

function createUser(req, res, next) {
    const newUser = {
        username: req.body.username,
    }
    const createNewUser = new User(newUser);
    User.register(createNewUser, req.body.password, (err, user) => {

        if (err) {
            return res.status(400).json({
                status: 'fail',
                message: 'User not created, try a different username.',
                error: err
            })
        }
        if (!user) {
            return res.status(500).json({
                status: 'fail',
                message: 'User not created.',
            })
        }
        req.login(user, (err) => {
            if (err) return res.status(500).json({
                status: 'fail',
                message: 'Failed to create session',
                error: err
            })
            res.status(201).json({
                status: 'success',
                message: 'User successfully created',
                data: req.user
            })
            return next();
        })
    })
}

function viewUser(req, res, next) {
    res.status(200).json({
        status: 'success',
        message: '',
        data: req.user
    })
}

function updateUser(req, res, next) {
    User.findOneAndUpdate({ username: req.body.username }, { username: req.body.newUsername }, { new: true })
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Cannot update non-existing user'
                })
            }
            user.changePassword(req.body.password, req.body.newPassword, (err) => {
                if (err) {
                    return res.status(500).json({
                        status: 'fail',
                        message: 'Something went wrong: could not update password',
                        error: err
                    })
                }
            })
            return next();
        })
        .catch((err) => {
            return res.status(404).json({
                status: 'fail',
                message: 'Cannot find user',
                error: err
            })
        })
}

function resetPassword(req, res, next){

}

function deleteUser(req, res, next) {
    User.findByIdAndDelete(req.user.id)
        .then((deletedUser) => {
            Task.deleteMany({ user: deletedUser.id })
                .then(() => {
                    req.logout((err) => {
                        if (err) {
                            return res.status(500).json({
                                status: 'fail',
                                message: 'Failed to delete user.',
                                error: err
                            })
                        }
                        res.status(200).json({
                            status: 'success',
                            message: 'User deleted successfully'
                        })
                        return next();
                    })
                }).catch((err) => {
                    return res.status(500).json({
                        status: 'fail',
                        message: 'Failed to delete user tasks.',
                        error: err
                    })
                });
        }).catch((err) => {
            return res.status(500).json({
                status: 'fail',
                message: 'Failed to delete user.',
                error: err
            })
        });
}

function login(req, res, next) {
    passport.authenticate('local', (err, user) => {
        if (err) {
            return res.status(400).json({
                status: 'fail',
                message: 'User not created, try a different username.',
                error: err
            })
        }
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'Incorrect username or password.',
            })
        }
        req.login(user, (err) => {
            if (err) return res.status(500).json({
                status: 'fail',
                message: 'Failed to create session',
                error: err
            })
            return next();
        })
    })(req, res, next);
}

function logout(req, res, next) {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({
                status: 'fail',
                message: 'An error occured: Failed to logout user.',
                error: err
            })
        }
        res.status(200).json({
            status: 'success',
            message: 'Logged out user.'
        })
        return next()
    })
}


module.exports = { createUser, viewUser, updateUser, resetPassword, deleteUser, login, logout }