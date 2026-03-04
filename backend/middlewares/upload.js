import multer from 'multer'

const storage = multer.memoryStorage()
export const uploadSingle = multer({ storage }).single('thumbnail')
export const uploadLectureVideo = multer({ storage }).single('video')
