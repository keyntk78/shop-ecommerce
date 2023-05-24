import { ProductCategoryModel } from '../models/index.js'
import asyncHandler from 'express-async-handler'

const createProductCategory = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error('Missing Input')
  const newProductCategory = await ProductCategoryModel.create(req.body)
  return res.status(200).json({
    success: newProductCategory ? true : false,
    createdProduct: newProductCategory
      ? newProductCategory
      : 'Cannot create a new product category',
  })
})

const getProductCategories = asyncHandler(async (req, res) => {
  const productCategories = await ProductCategoryModel.find().select('title')
  return res.status(200).json({
    success: productCategories ? true : false,
    createdProduct: productCategories
      ? productCategories
      : 'Cannot get all product category',
  })
})

const updateProductCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params
  if (!pcid) throw new Error('Missing input')
  const updatedProductCategory = await ProductCategoryModel.findByIdAndUpdate(
    pcid,
    req.body,
    { new: true }
  ).select('title')
  return res.status(200).json({
    success: updatedProductCategory ? true : false,
    createdProduct: updatedProductCategory
      ? updatedProductCategory
      : 'Cannot update  product category',
  })
})

const deleteProductCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params
  if (!pcid) throw new Error('Missing input')
  const deletedProductCategory = await ProductCategoryModel.findByIdAndDelete(
    pcid
  )
  return res.status(200).json({
    success: deletedProductCategory ? true : false,
    createdProduct: deletedProductCategory
      ? deletedProductCategory
      : 'Cannot update  product category',
  })
})

export default {
  createProductCategory,
  getProductCategories,
  updateProductCategory,
  deleteProductCategory,
}
