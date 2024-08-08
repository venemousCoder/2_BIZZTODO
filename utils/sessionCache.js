function updateCache(method = 'update', id, newUpdate, req, res, next) {
    console.log('object');
    if (method.toLowerCase() === 'delete') {
        for (i = 0; i <= req.session.tasks.length; i++) {
            if (id === req.session.tasks[i]._id) {
                req.session.tasks[i] = '';
                req.session.save((err) => {
                    if (err) {
                        return res.status(500).json({
                            status: 'fail',
                            message: 'could not update session cache.',
                            error: err
                        })
                    }
                })
                return next()
            }
        }
    }
    for (i = 0; i <= req.session.tasks.length; i++) {
        if (id === req.session.tasks[i]._id) {
            console.table(['inloop', req.session.tasks[i]]);
            req.session.tasks[i] = newUpdate;
            req.session.save((err) => {
                if (err) {
                    return res.status(500).json({
                        status: 'fail',
                        message: 'could not update session cache.',
                        error: err
                    })
                }
            })
            return next()
        }
    }

}

module.exports = updateCache;