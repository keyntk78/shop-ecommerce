import express from 'express'
import { ProductController } from '../controllers/index.js'
import { verifyAccessToken, isAdmin } from '../middlewares/verifyToken.js'
const router = express.Router()

//admin
router.post('/', [verifyAccessToken, isAdmin], ProductController.createProduct)

router.get('/', ProductController.getProducts)

router.put(
  '/:pid',
  [verifyAccessToken, isAdmin],
  ProductController.updateProduct
)
router.delete(
  '/:pid',
  [verifyAccessToken, isAdmin],
  ProductController.deleteProduct
)
router.get('/:pid', ProductController.getProduct)

export default router
