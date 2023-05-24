import { BlogCategoryModel } from '../models/index.js'
import asyncHandler from 'express-async-handler'

const createBlogCategory = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error('Missing Input')
  const newBlogCategory = await BlogCategoryModel.create(req.body)
  return res.status(200).json({
    success: newBlogCategory ? true : false,
    createdBlog: newBlogCategory
      ? newBlogCategory
      : 'Cannot create a new blog category',
  })
})

const getBlogCategories = asyncHandler(async (req, res) => {
  const blogCategories = await BlogCategoryModel.find().select('title')
  return res.status(200).json({
    success: blogCategories ? true : false,
    createdBlog: blogCategories
      ? blogCategories
      : 'Cannot get all blog category',
  })
})

const updateBlogCategory = asyncHandler(async (req, res) => {
  const { bcid } = req.params
  if (!bcid) throw new Error('Missing input')
  const updatedBlogCategory = await BlogCategoryModel.findByIdAndUpdate(
    bcid,
    req.body,
    { new: true }
  ).select('title')
  return res.status(200).json({
    success: updatedBlogCategory ? true : false,
    createdBlog: updatedBlogCategory
      ? updatedBlogCategory
      : 'Cannot update  Bbog category',
  })
})

const deleteBlogCategory = asyncHandler(async (req, res) => {
  const { bcid } = req.params
  if (!bcid) throw new Error('Missing input')
  const deletedBlogCategory = await BlogCategoryModel.findByIdAndDelete(bcid)
  return res.status(200).json({
    success: deletedBlogCategory ? true : false,
    createdBlog: deletedBlogCategory
      ? deletedBlogCategory
      : 'Cannot update  Blog category',
  })
})

export default {
  createBlogCategory,
  getBlogCategories,
  updateBlogCategory,
  deleteBlogCategory,
}
