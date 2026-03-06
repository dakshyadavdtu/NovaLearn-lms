import multer from 'multer'

const storage = multer.memoryStorage()
export const uploadSingle = multer({ storage }).single('thumbnail')
export const uploadAvatar = multer({ storage }).single('avatar')
export const uploadLectureVideo = multer({ storage }).single('video')
