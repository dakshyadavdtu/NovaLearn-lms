import mongoose from 'mongoose'

const lectureSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String },
    videoURL: { type: String },
    isPreviewFree: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.model('Lecture', lectureSchema)
