const jsonwebtoken = require('jsonwebtoken')
function generateToken(user) {
    if (user) {
        let signedToken = jsonwebtoken.sign(
            {
                data: user._id,
                exp: new Date().setDate(new Date().getDate() + 1)
            },
            process.env.SECRET
        );
        return signedToken;
    }
    return new Error('userException: user not found');
}

function verifyJwt(req, res, next) {
    const token = res.locals.token || app.get('token') || req.query.token
    if (token) {
        jsonwebtoken.verify(token, '1234567890', (error, payload) => {
            if (payload) {
                admin
                    .findById(payload.data).then(user => {
                        if (user) {
                            return next();
                        } else {
                            return res.status(401).json({
                                error: error,
                                message: "No User account found."
                            })
                        }
                    })
            } else {
                return res.status(401).json({
                    error: error,
                    message: "Cannot verify API token."
                });
            }
        })
    } else {
        return res.status(401).json({
            error: true,
            message: "Provide Token"
        });
    }
}
module.exports = { generateToken, verifyJwt }