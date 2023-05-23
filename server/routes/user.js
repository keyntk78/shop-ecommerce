import express from 'express'
import { UserController } from '../controllers/index.js'
import { verifyAccessToken, isAdmin } from '../middlewares/verifyToken.js'
const router = express.Router()

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/refreshtoken', UserController.refreshAccessToken)
router.get('/logout', UserController.logout)
router.get('/forgotpassword', UserController.forgotPassword)
router.put('/resetpassword', UserController.resetPassword)

//login
router.get('/current', verifyAccessToken, UserController.getCurrent)
router.put('/current', verifyAccessToken, UserController.updateUserCurent)

//admin
router.get('/', [verifyAccessToken, isAdmin], UserController.getUsers)
router.delete('/', [verifyAccessToken, isAdmin], UserController.deleteUser)
router.put('/:uid', [verifyAccessToken, isAdmin], UserController.updateUser)

export default router
