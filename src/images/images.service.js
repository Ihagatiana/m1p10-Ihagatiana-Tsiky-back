const fs = require('fs');
const path = require('path');
const Images = require('./images.model'); 

const saveImageToFolderAndDatabase = async (imagesBuffers, file) => {
    try {
      if (imagesBuffers && imagesBuffers.length > 0) {
        const imageIds = [];
        for (let index = 0; index < imagesBuffers.length; index++) {
          const imageBuffer = imagesBuffers[index];
          const imageName = file[index].originalname;
          const imagePath = path.join('src/images/uploads', imageName);
          console.log('Image Name:', imageName);
          console.log('Image Path:', imagePath);
          try {
            fs.writeFileSync(imagePath, imageBuffer);
          } catch (writeError) {
            console.error('Erreur lors de l\'écriture du fichier :', writeError);
            throw writeError;
          }

          const savedImage = await Images.create({
            name: imageName,
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
