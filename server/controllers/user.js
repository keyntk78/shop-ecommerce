import { UserModel } from '../models/index.js'
import asyncHandler from 'express-async-handler'

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, mobile } = req.body
  if (!email || !password || !firstname || !lastname || !mobile) {
    return res.status(400).json({ success: false, message: 'Missing Input' })
  }

  const reponse = await UserModel.create(req.body)
  return res.status(200).json({ success: reponse ? true : false, reponse })
})

export default {
  register,
}
