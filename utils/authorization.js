function isAuthorized(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            status: 'fail',
            message: 'You must login first to access this page.'
        })
    }
    return next();
}

function taskAuthorization(req, res, next) {
    if (req.user.tasks){

    }
}

module.exports = { isAuthorized, taskAuthorization }