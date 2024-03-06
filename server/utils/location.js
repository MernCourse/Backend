const axios = require('axios')

const httpError = require('../models/http-error')
const { MAPS_URL } = require('./constants')

async function getCoordForAddress(address){
    const finalUrl = MAPS_URL
                        .replace('<address>', 
                                encodeURIComponent(address))
    const res = await axios.get(finalUrl)
    const data = res.data
    if (!data || data.status === 'ZERO_RESULTS'){
        throw new httpError('Could not find location!!', 422)
    }
    return data.results[0].geometry.location
}

exports.getCoordForAddress = getCoordForAddress