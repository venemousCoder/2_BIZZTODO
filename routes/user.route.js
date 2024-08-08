const router = require('express').Router();
const userControllers = require('../controllers/userControllers');
const tasksControllers = require('../controllers/tasksControllers');
const authorization = require('../utils/authorization');
const { validationResult, body, check } = require('express-validator');

router.post('/create',
    body('password', 'password cannot be empty and must be greater than 2 characters')
        .notEmpty()
        .isLength({ min: 3 }),
    body('username', 'Invalid username: cannot be empty')
        .notEmpty()
        .isString()
        .trim(),
    (req, res, next) => {
        res.locals.valResult = validationResult(req);
        if (!res.locals.valResult.isEmpty()) {
            req.skip = true;
            res.status(405).json({
                status: 'fail',
                message: 'Try again',
                error: res.locals.valResult.errors[0].msg
            });
        }
        next();
    }, userControllers.createUser);

router.post('/login', body('password', 'password cannot be empty and must be greater than 2 characters')
    .notEmpty()
    .isLength({ min: 3 }),
    //
    //**************************************** VALIDATING EMAIL FIELD ********************************************/
    //
    // body('email', 'Invalid email')
    //     .notEmpty()
    //     .trim()
    //     .isEmail()
    //     .normalizeEmail(),
    body('username', 'Invalid username: cannot be empty')
        .notEmpty()
        .isString()
        .trim(),
    //
    //**************************************** HANDLING VALIDATION RESULT ****************************************/
    //
    (req, res, next) => {
        res.locals.valResult = validationResult(req);
        if (!res.locals.valResult.isEmpty()) {
            req.skip = true;
            res.status(405).json({
                status: 'fail',
                message: 'Try again',
                error: res.locals.valResult.errors[0].msg
            });
        }
        next();
    }, userControllers.login, tasksControllers.viewTasks);

/******************************** PROTECTED  ROUTES *********************/

router.use(authorization.isAuthorized);
router.get('/logout', userControllers.logout);

/******************************** USER CRUD OPS *************************/

router.get('/profile', userControllers.viewUser);
router.post('/update', userControllers.updateUser, userControllers.logout);
router.get('/delete', userControllers.deleteUser);

/******************************** TASKS CRUD OPS *************************/

router.post('/filterTasks', tasksControllers.filterTasks);
router.post('/createTask', tasksControllers.createTask);
router.get('/tasks', tasksControllers.viewTasks);
router.post('/updateTask', tasksControllers.updateTask, tasksControllers.viewTasks);
router.get('/deleteTask', tasksControllers.deleteTask, tasksControllers.viewTasks);



module.exports = router;
