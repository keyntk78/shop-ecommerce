import user from './user.js'
import product from './product.js'
import productCategory from './productCategory.js'
import blogCategory from './blogCategory.js'

import { errHandler, notFound } from '../middlewares/enHandler.js'

const initRouter = (app) => {
  app.use('/api/user', user)
  app.use('/api/product', product)
  app.use('/api/product-category', productCategory)
  app.use('/api/blog-category', blogCategory)

  app.use(notFound)
  app.use(errHandler)
}

export default initRouter
