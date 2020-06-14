const mongoose = require('mongoose')

try {
    mongoose.connect(process.env.ATLAS_CONNECTION_STRING, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
} catch (error) {
    console.log(error)
}