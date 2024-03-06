const jwt = require('jsonwebtoken')

const httpError = require('../models/http-error')
const { JWT_SECRET_WORD} = require('../utils/constants')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS'){
        return next()
    }
    let token = false
    try {
        token = req.headers.authorization.split(' ')[1]
        // if no token providen!!
        if (!token){
            throw new httpError('Authetication failed!!', 401)
        }
        const decodedToken = jwt.verify(token, JWT_SECRET_WORD)
        req.userData = { userId: decodedToken.userId}
        next()
    } catch (error) {
        return next(error)
    }
    
}