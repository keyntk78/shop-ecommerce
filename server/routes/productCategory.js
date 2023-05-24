import express from 'express'
import { ProductCategoryController } from '../controllers/index.js'
import { verifyAccessToken, isAdmin } from '../middlewares/verifyToken.js'
const router = express.Router()

//admin
router.post(
  '/',
  [verifyAccessToken, isAdmin],
  ProductCategoryController.createProductCategory
)
router.get('/', ProductCategoryController.getProductCategories)
router.put(
  '/:pcid',
  [verifyAccessToken, isAdmin],
  ProductCategoryController.updateProductCategory
)
router.delete(
  '/:pcid',
  [verifyAccessToken, isAdmin],
  ProductCategoryController.deleteProductCategory
)

export default router
