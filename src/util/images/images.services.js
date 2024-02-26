const fs = require('fs');
const path = require('path');
const Images = require('./images.model'); 
const { v4: uuidv4 } = require('uuid');


const saveImageToFolderAndDatabase = async (imagesBuffers, file) => {
    try {
      if (imagesBuffers && imagesBuffers.length > 0) {
        const imageIds = [];
        for (let index = 0; index < imagesBuffers.length; index++) {
          const imageBuffer = imagesBuffers[index];

          const imageName = file[index].originalname;
          const fileExtension = path.extname(imageName); 
          const imageId = uuidv4();
          const imageFileName = `${imageId}${fileExtension}`;

          const imagePath = path.join('src/util/images/uploads', imageFileName);
          console.log('Image Name:', imageFileName);
          console.log('Image Path:', imagePath);
          try {
            fs.writeFileSync(imagePath, imageBuffer);
          } catch (writeError) {
            console.error('Erreur lors de l\'écriture du fichier :', writeError);
            throw writeError;
          }

          const savedImage = await Images.create({
            name: imageFileName,
            url: imagePath,
            mimetype: file[index].mimetype
          });
          imageIds.push(savedImage._id);
        }
        return imageIds;
      }
    } catch (error) {
      throw error;
    }
}
module.exports = {saveImageToFolderAndDatabase};