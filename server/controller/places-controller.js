const  mongoose = require('mongoose')
const fs = require('fs')
const { validationResult } = require('express-validator')

const httpError = require('../models/http-error')
const { getCoordForAddress } = require('../utils/location')
const Place  = require('../models/place')
const User = require('../models/user')

async function getPlaceById(req, res, next){
    let place = false

    try {
        place = await Place.findById(req.params.placeId)
    } catch (error) {
        return next(new httpError('Error looking for object!!', 500))
    }

    if (!place){
        return next(new httpError('No place to be found!!', 404))
    }
    res.json(place)
}

async function getPlacesByUserId(req, res, next){
    let user = false
    try {
        user = await User.findById(req.params.userId).populate('places')
        // place = await Place.find({creator: req.params.userId})
    } catch (error) {
        return next(new httpError('Error looking for user places!!', 500))
    }

    if (!user || user.places.length == 0){
        return next(new httpError('No places found for the user!!', 404))    
    }

    return res.json(user.places)
}

async function setNewPlace(req, res, next){
    const err = validationResult(req)
    if (! err.isEmpty()){
        // Error handler
        console.log(err);
        return next(new httpError('No places provided!!', 404)) 
    }

    const {title, description, address} = req.body
    
    let coord = null
    try{
        coord = await getCoordForAddress(address)
    }catch(e){
        return next(e)
    }

    const place = new Place({
        title,
        description, 
        address,
        location: coord,
        image: '\\' + req.file.path, 
        creator: req.userData.userId
    })

    let user = false
    try {
        user = await User.findById(req.userData.userId)
    } catch (error) {
        return next(new httpError('Error building place!!', 404))
    }

    if (!user){
        return next(new httpError('Error: user doesn\'t exist!!', 404))
    }

    try{
        const session = await mongoose.startSession()
        session.startTransaction()
        await place.save({session: session })
        user.places.push(place)
        await user.save({session: session})
        await session.commitTransaction()
    }catch(e){
        return next(new httpError('Error saving object!!', 500))
    }
    
    return res.status(201).json(place)
}

async function updatePlace(req, res, next){
    const err = validationResult(req)
    const placeId = req.params.placeId
    if (!(err.isEmpty() && placeId)){
        // Error handler
        throw new httpError('No places or place Id provided!!', 404)
    }
    const {title, description} = req.body
    let place = false
    try {
        place = await Place.findById(placeId)
    } catch (error) {
        return next(new httpError('Place could not be found!!', 404))
    }
    if (!place){
        return next(new httpError('Place could not be found!!', 404))
    }
    
    if (place.creator.toString() !== req.userData.userId){
        return next(new httpError('Place could not be edit, different creator!!', 401))
    }
    place.title = title
    place.description = description

    try {
        await place.save()
    } catch (error) {
        return next(new httpError('Place could not be saved!!', 500))
    }

    return res.status(200).json(place)
}

async function deletePlace(req, res, next){
    const placeId = req.params.placeId
    if (!placeId){
        // Error handler
        throw new httpError('No place Id provided!!', 404)
    }
    let place = false
    try {
        place = await Place.findById(placeId).populate('creator')
    } catch (error) {
        return next(new httpError('Error looking for place!!', 404))
    }
    if (!place){
        return next(new httpError('Place could not be found!!', 404))
    }

    if (place.creator._id.toString() !== req.userData.userId){
        return next(new httpError('Place could not be edit, different creator!!', 401))
    }

    const imgPath = place.image
    try {
        const session = await mongoose.startSession()
        session.startTransaction()
        await place.deleteOne({session: session})
        place.creator.places.pull(place)
        await place.creator.save({session: session})
        await session.commitTransaction()
    } catch (error) {
        return next(new httpError('Place could not be deleted!!', 500))
    }

    fs.unlink(process.cwd() + imgPath, err => {
        console.log(err);
    })

    return res.status(200).json({message: `Place id: ${req.params.placeId} has been deleted!!`})
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId    
exports.setNewPlace = setNewPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace