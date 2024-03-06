const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const httpError = require('../models/http-error')
const User = require('../models/user')
const { JWT_SECRET_WORD, JWT_EXPIRE } = require('../utils/constants')

async function getAllUsers(req, res, next){
    let users = []
    try {
        users = await User.find({}, '-password')
    } catch (error) {
        return next(new httpError('Error looking for users!!', 500))
    }

    if (users.length == 0){
        return next(new httpError('No users found!!', 404))    
    }

    return res.json(users)
}

async function checkUserIdentity(req, res, next){
    const { email, password } = req.body
    // let's bring the user data
    let newUser = false
    try {
        newUser = await User.findOne({email: email})
    } catch (error) {
        return next(new httpError('Server connection error!!', 500))
    }
    // let's check if user email exists
    if (!newUser){
        return next(new httpError('User could not be found!!', 401))
    }
    // let's check if provided password matches.
    let isValidPass
    try {
        isValidPass = await bcrypt.compare(password, newUser.password)
    } catch (error) {
        return next(new httpError('Server connection error!!', 500))
    }
    if (!isValidPass){
        return next(new httpError('User could not be found!!', 401))
    }

    let token 
    try {
        token = jwt.sign(
            {   
                userId: newUser._id, 
                email: newUser.email
            }, 
            JWT_SECRET_WORD, 
            JWT_EXPIRE)
    } catch (error) {
        return next(new httpError('Error logging user!!', 500))
    }
    
    return res.status(200).json({
        message: 'User logged in!!', 
        userData: 
            {
                _id: newUser._id,
                name: newUser.name,
                token: token
            }
    })
}

async function setNewUser(req, res, next){
    const err = validationResult(req)
    if (!err.isEmpty() ){
        // Error handler
        return next(new httpError('Not a valid user provided!!', 401))
    }

    const { name, email, password } = req.body
    let newUser = false

    try {
        newUser = await User.findOne({email: email})
    } catch (error) {
        return next(new httpError('Connection error!!', 500))
    }

    if (newUser){
        return next(new httpError('User already exists!!', 401))
    }
    let hashPass
    try {
        hashPass = await bcrypt.hash(password, 12)    
    } catch (error) {
        return next(new httpError('Error saving user!!', 500))
    }
    
    const imageRelativePath = req.file.path.replace(process.cwd(), '')

    newUser = new User({
        name, 
        email, 
        password: hashPass,
        image: imageRelativePath,
        places: []
    })
    try {
        newUser.save()
    } catch (error) {
        return next(new httpError('Error saving user!!', 500))
    }
    let token 
    try {
        token = jwt.sign(
            {   
                userId: newUser._id, 
                email: newUser.email
            }, 
            JWT_SECRET_WORD, 
            JWT_EXPIRE)
    } catch (error) {
        return next(new httpError('Error saving user!!', 500))
    }
    return res.status(201).json({ 
        userData: 
            {
                _id: newUser._id,
                name: newUser.name,
                token: token
            }
    })
}

exports.getAllUsers = getAllUsers
exports.checkUserIdentity = checkUserIdentity    
exports.setNewUser = setNewUser