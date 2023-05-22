import mongoose from 'mongoose'

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    if (conn.connection.readyState === 1)
      console.log('Db connection successfully')
    else console.log('Db connection is failed')
  } catch (error) {
    console.log('Db connection is failed')
    throw new Error(error)
  }
}

export default dbConnect
