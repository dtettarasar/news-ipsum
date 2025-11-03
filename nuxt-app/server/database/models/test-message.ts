import mongoose from 'mongoose'

const TestMessageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('TestMessage', TestMessageSchema)