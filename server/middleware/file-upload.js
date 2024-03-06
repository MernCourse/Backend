const multer = require('multer')
const { v1: uuid } = require('uuid')
const path = require('path')

const { MIME_TYPE_MAP } = require('../utils/constants')


const fileUpload = multer({
    limits: { filesSize: 500000 },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, process.cwd() + '/'+ path.join('uploads', 'images'))
        },  
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype]
            cb(null, uuid() + '.' + ext)
        }
    }),
    fileFiter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype]
        let error = isValid ? null : new Error('Invalid Mime type!!')
        cb(error, isValid)
    }
})

module.exports = fileUpload