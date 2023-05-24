import mongoose, { Schema } from 'mongoose'

var productCategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('ProductCategory', productCategorySchema)
