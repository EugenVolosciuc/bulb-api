const express = require('express')
const app = express()
const cors = require('cors')

require('dotenv').config()
require('./db/mongoose')

const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/ideas', require('./routes/idea'))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))