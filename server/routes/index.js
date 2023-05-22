import user from './user.js'
import { errHandler, notFound } from '../middlewares/enHandler.js'

const initRouter = (app) => {
  app.use('/api/user', user)

  // app.use('/', (req, res) => {
  //   res.send('SERVER ON')
  // })
  app.use(notFound)
  app.use(errHandler)
}

export default initRouter
