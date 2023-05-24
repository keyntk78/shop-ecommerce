import mongoose, { Schema } from 'mongoose'

var productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
    },
    quantity: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
      enum: ['Black', 'White', 'Red', 'Green', 'Yellow'],
    },
    ratings: [
      {
        star: { type: Number },
        postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
        comment: { type: String },
      },
    ],

    totalRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Product', productSchema)
