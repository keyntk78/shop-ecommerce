import { ProductModel } from '../models/index.js'
import asyncHandler from 'express-async-handler'
import slugify from 'slugify'

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error('Missing Input')
  if (req.body && req.body.title) {
    req.body.slug = slugify(req.body.title)
  }
  const newProduct = await ProductModel.create(req.body)

  return res.status(200).json({
    success: newProduct ? true : false,
    createdProduct: newProduct ? newProduct : 'Cannot create a new product',
  })
})

const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params
  const product = await ProductModel.findById(pid)

  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : 'Cannot get  product',
  })
})

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
  const updatedProduct = await ProductModel.findByIdAndUpdate(pid, req.body, {
    new: true,
  })

  return res.status(200).json({
    success: updatedProduct ? true : false,
    productData: updatedProduct ? updatedProduct : 'Cannot update  product',
  })
})

const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params
  const deletedProduct = await ProductModel.findByIdAndDelete(pid)

  return res.status(200).json({
    success: deletedProduct ? true : false,
    productData: deletedProduct ? deletedProduct : 'Cannot delete  product',
  })
})

// Filtering, sorting, and pagination
const getProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query }

  //tách các trường đặt biệt ra khỏi query
  const excludeFields = ['limit', 'sort', 'page', 'fields']
  excludeFields.forEach((item) => delete queries[item])

  //Format lại các operators cho đúng cú pháp moogoose
  let queryString = JSON.stringify(queries)
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthed) => `$${macthed}`
  )
  const formatedQueries = JSON.parse(queryString)
  //Filtering
  if (queries?.title)
    formatedQueries.title = { $regex: queries.title, $options: 'i' }
  let queryCommand = ProductModel.find(formatedQueries)

  //Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    queryCommand = queryCommand.sort(sortBy)
  } else {
    queryCommand = queryCommand.sort('-createdAt')
  }

  //Fields limiting
  if (req.query.fields) {
    const field = req.query.fields.split(',').join(' ')
    queryCommand = queryCommand.select(field)
  } else {
    queryCommand = queryCommand.select('-__v')
  }

  //panigation
  const page = +req.query.page || 1
  const limit = +req.query.limit || process.env.LIMIT_PAGE
  const skip = (page - 1) * limit
  queryCommand = queryCommand.skip(skip).limit(limit)

  queryCommand
    .then(async (response) => {
      const counts = await ProductModel.find(formatedQueries).countDocuments()
      return res.status(200).json({
        success: response ? true : false,
        products: response ? response : 'Cannot  get  products',
        counts: counts,
      })
    })
    .catch((err) => {
      console.log(err.message)
    })
})

const ratingProduct = asyncHandler(async (req, res) => {
  const { _id } = req.user
  const { star, comment, pid } = req.body
  if (!_id) throw new Error('Missing input')
  if (!star || !pid) throw new Error('Missing input')
  const product = await ProductModel.findById(pid)

  const alreadyRating = product?.ratings?.find(
    (item) => item.postedBy.toString() === _id
  )
  if (alreadyRating) {
    //update star and comment
    await ProductModel.updateOne(
      {
        ratings: { $elemMatch: alreadyRating },
      },
      { $set: { 'ratings.$.star': star, 'ratings.$.comment': comment } },
      { new: true }
    )
  } else {
    //add star and comment
    await ProductModel.findByIdAndUpdate(
      pid,
      { $push: { ratings: { star: star, comment: comment, postedBy: _id } } },
      { new: true }
    )
  }

  const updatedProduct = await ProductModel.findById(pid)
  const ratingCount = updatedProduct?.ratings.length
  const sumRatings = updatedProduct.ratings.reduce(
    (sum, item) => sum + item.star,
    0
  )

  updatedProduct.totalRating = Math.round((sumRatings * 10) / ratingCount) / 10
  await updatedProduct.save()

  return res.status(200).json({ success: true, updatedProduct: updatedProduct })
})

export default {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratingProduct,
}
