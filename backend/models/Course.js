import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: false },
    thumbnail: { type: String },
    lectures: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Lecture',
        },
      ],
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.model('Course', courseSchema)
