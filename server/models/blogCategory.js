import mongoose, { Schema } from 'mongoose'

var blogCategorySchema = new Schema(
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

export default mongoose.model('BlogCategory', blogCategorySchema)
