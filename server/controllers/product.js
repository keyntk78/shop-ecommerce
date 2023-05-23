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
  const products = await ProductModel.find()

  return res.status(200).json({
    success: products ? true : false,
    productData: products ? products : 'Cannot  get  products',
  })
})

export default {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
}
