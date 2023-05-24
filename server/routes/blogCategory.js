import express from 'express'
import { BlogCategoryController } from '../controllers/index.js'
import { verifyAccessToken, isAdmin } from '../middlewares/verifyToken.js'
const router = express.Router()

//admin
router.post(
  '/',
  [verifyAccessToken, isAdmin],
  BlogCategoryController.createBlogCategory
)
router.get('/', BlogCategoryController.getBlogCategories)
router.put(
  '/:bcid',
  [verifyAccessToken, isAdmin],
  BlogCategoryController.updateBlogCategory
)
router.delete(
  '/:bcid',
  [verifyAccessToken, isAdmin],
  BlogCategoryController.deleteBlogCategory
)

export default router
