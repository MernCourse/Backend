let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Cerro Chirripó',
        description: 'El monte más alto de Costa Rica',
        location:{
            lat: 9.4840,
            lng: -83.4886
        },
        address: 'Cordillera de Talamanca',
        creator: 'u1'
    }
]

let DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Ellioth Ramirez Trejos',
        email: 'oiewoe@jioewe.com',
        password: 'iohfweie'
    }
]

const MAPS_URL = `https://maps.googleapis.com/maps/api/geocode/json?address=<address>&key=${process.env.MAPS_API_KEY}`

// const DB_LINK = `mongodb+srv://mern-course:${DB_PASSWORD}@cluster0.8nwtq6g.mongodb.net/places?retryWrites=true&w=majority`;
const DB_LINK = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8nwtq6g.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg'
}

const JWT_EXPIRE = { expiresIn: '1h' }

module.exports =  {
    DUMMY_PLACES: DUMMY_PLACES, 
    DUMMY_USERS: DUMMY_USERS,
    MAPS_URL: MAPS_URL,
    DB_LINK: DB_LINK,
    MIME_TYPE_MAP: MIME_TYPE_MAP,
    JWT_SECRET_WORD: process.env.JWT_SECRECT_KEY,
    JWT_EXPIRE: JWT_EXPIRE,
    SAVED_IMAGES: process.env.SAVED_IMAGES
}