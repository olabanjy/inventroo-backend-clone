const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileupload = require('express-fileupload')
const { readdirSync } = require('fs')

require('dotenv').config()

// App
const app = express()

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('DB Connected'))
  .catch((err) => console.log('DB err', err))

// Middleware
app.use(morgan('dev'))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json())
app.use(cors())
app.use(fileupload({ useTempFiles: true }))

// all routes

readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)))

const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server is running on port ${port}`))
