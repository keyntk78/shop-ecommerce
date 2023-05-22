import express from 'express'
import { UserController } from '../controllers/index.js'

const router = express.Router()

router.post('/register', UserController.register)
// router.post('/register', (req, res) => {
//   res.send('dang ky')
// })

export default router
