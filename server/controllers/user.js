import { UserModel } from '../models/index.js'
import asyncHandler from 'express-async-handler'
import { generateAccessToken, generateRefreshToken } from '../ultils/jwt.js'
import jwt from 'jsonwebtoken'
import { sendMail } from '../ultils/sendmail.js'
import crypto from 'crypto'

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, mobile } = req.body
  if (!email || !password || !firstname || !lastname || !mobile) {
    return res.status(400).json({ success: false, message: 'Missing Input' })
  }

  const user = await UserModel.findOne({ email })
  const phone = await UserModel.findOne({ mobile: mobile })

  if (user) throw new Error('User already exists')
  if (phone) throw new Error('Mobile already exists')
  else {
    const reponse = await UserModel.create(req.body)
    return res.status(200).json({
      success: reponse ? true : false,
      message: reponse
        ? 'Register is successfully. Please go login'
        : 'Something went wrong',
    })
  }
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Missing Input' })
  }

  const user = await UserModel.findOne({ email })
  if (user && (await user.isCorrectPassword(password))) {
    //tách password và role ra khỏi user
    const { password, role, ...userData } = user.toObject()

    // tào accesstoken và refreshtoken
    const accessToken = generateAccessToken(user._id, role)
    const refreshToken = generateRefreshToken(user._id)

    // lưu refreshtoken vao database
    await UserModel.findByIdAndUpdate(
      user._id,
      { refreshToken: refreshToken },
      { new: true }
    )

    // lưu refreshToken vào cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({
      success: true,
      message: 'Login success!',
      accessToken,
      userData,
    })
  } else {
    throw new Error('Invalid credentials!')
  }
})

const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user
  const user = await UserModel.findById(_id).select(
    '-refreshToken -password -role'
  )

  return res
    .status(200)
    .json({ success: true, response: user ? user : 'user not found' })
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  // lấy token từ cookie
  const cookie = req.cookies

  // check xem có token hay không
  if (!cookie && !cookie.refreshToken) {
    throw new Error('No refresh token in cookie')
  }

  const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
  const response = await UserModel.findOne({
    _id: result._id,
    refreshToken: cookie.refreshToken,
  })

  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : 'Refresh token not matched!',
  })
})

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies
  if (!cookie && !cookie.refreshToken) {
    throw new Error('No refresh token in cookie')
  }

  // xóa refresh token db
  await UserModel.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: '' },
    { new: true }
  )
  // xóa refresh token cookie trình duyệt
  res.clearCookie('refreshToken', { httpOnly: true, secure: true })

  return res.status(200).json({ success: true, message: 'Logout successfully' })
})

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query

  if (!email) throw new Error('Missing email')
  const user = await UserModel.findOne({ email })
  if (!user) throw new Error('User not found')
  const resetToken = await user.createPasswordChangeToken()
  await user.save()

  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của ban. Link này sẽ hết hạn 15 phút kể từ bây giờ.  <a href='${process.env.URL_SERVER}/api/user/reset-password/${resetToken}'>Nhấn vào đây</a> `

  const data = {
    email: email,
    subject: 'Thay đổi mật khẩu',
    html,
  }

  const result = await sendMail(data)

  return res.status(200).json({ success: true, result })
})

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')
  const user = await UserModel.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  })

  if (!user) throw new Error('Invalid resetpassword token')
  user.password = password
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  user.passwordChangeAt = Date.now()
  await user.save()

  return res.status(200).json({
    success: user ? true : false,
    message: user ? 'Updated password successfully' : 'Something went wrong',
  })
})

const getUsers = asyncHandler(async (req, res) => {
  const respone = await UserModel.find().select('-refreshToken -password -role')
  return res
    .status(200)
    .json({ success: respone ? true : false, users: respone })
})

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query
  if (!_id) throw new Error('Missing input')
  const respone = await UserModel.findByIdAndDelete(_id)
  return res.status(200).json({
    success: respone ? true : false,
    message: respone
      ? `User with email ${respone.email} deleted`
      : 'No user delete',
  })
})

const updateUserCurent = asyncHandler(async (req, res) => {
  const { _id } = req.user
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error('Missing input')
  const respone = await UserModel.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select('-password -role -refreshToken')

  return res.status(200).json({
    success: respone ? true : false,
    message: respone ? respone : 'Something went wrong',
  })
})

const updateUser = asyncHandler(async (req, res) => {
  const { uid } = req.params
  if (!uid || Object.keys(req.body).length === 0)
    throw new Error('Missing input')
  const respone = await UserModel.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select('-password -role -refreshToken')

  return res.status(200).json({
    success: respone ? true : false,
    message: respone ? respone : 'Something went wrong',
  })
})

export default {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  updateUserCurent,
  updateUser,
}
