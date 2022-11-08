const { cloudinary } = require('../config/cloudinary')


async function uploadImage(file){
  try {
     const uploadedFileResponse = await cloudinary.uploader.upload(file)
     console.log(uploadedFileResponse)
     return uploadedFileResponse
    } catch(e){
       console.log(e)
       throw new Error(e)
   }
}

module.exports = { uploadImage } 