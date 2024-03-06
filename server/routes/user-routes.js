const express = require('express')
const { check } = require('express-validator')

const userController = require('../controller/users-controller')
const fileUpload = require('../middleware/file-upload')

const router = express.Router()

router.get('/', userController.getAllUsers)

router.post('/signup', 
            fileUpload.single('image'),
            [
                check('name')
                    .not()
                    .isEmpty(),
                check('email')
                    .normalizeEmail()
                    .isEmail(),
                check('password')
                    .isLength({min: 6})
            ], 
            userController.setNewUser)

router.post('/login', userController.checkUserIdentity)

module.exports = router