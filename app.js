const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')

const placesRoutes = require('./server/routes/places-routes')
const userRoutes = require('./server/routes/user-routes')
const httpError = require('./server/models/http-error')
const { DB_LINK, SAVED_IMAGES } = require('./server/utils/constants')

const app = express()

app.use(cors())

app.use(bodyParser.json())

app.use('/uploads/images', express.static(process.cwd() + SAVED_IMAGES))

app.use('/api/users', userRoutes)

app.use('/api/places', placesRoutes)

app.use((req, res, next) => {
    throw new httpError('Could not find the specified route!!', 404)
})

app.use((error, req, res, next) => {
    // rolling back the image to unsave-it
    if (req.file){
        fs.unlink(req.file.path, err => {
            console.log(err);
        })
    }
    error.code = (error.code && !isNaN(error.code)) ? error.code : 500
    if (res.headerSent){
        return next(error)
    }
    res
        .status(error.code)
        .json({message: error.message || 'Error: Unknow error!!'})
})

mongoose
    .connect(DB_LINK)
    .then(() => {
        app.listen(process.env.PORT || 5000)
    }).catch((e) => {
        console.log(e);
    })