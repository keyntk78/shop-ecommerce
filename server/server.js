import express from 'express'
import * as dotenv from 'dotenv'
dotenv.config()
import dbConnect from './config/dbConnect.js'
import initRouter from './routes/index.js'
import cookieParser from 'cookie-parser'

const app = express()

const port = process.env.PORT || 8888

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

initRouter(app)

app.listen(port, async () => {
  await dbConnect()
  console.log('Server running on port: ' + port)
})
