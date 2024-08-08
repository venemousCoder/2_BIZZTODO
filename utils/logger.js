function logger(req, res, next) {
    console.log(`URL: ${req.url}`);
    console.table([req.session]);
    if (req.user) console.table(['USER',req.user]);
    console.table([req.session.cookie]);
    next();
}

module.exports = logger;