const {v4: uuidv4} = require('uuid');

const params = (fileName) => {
    const myFile = fileName.originalname.split('.');
    const fileType = myFile[myFile.length - 1];

    const imageParams = {
        Bucket: 'user-images-d585c4e4-c4e2-4e5f-ad34-ee35da0d4254',
        Key: `${uuidv4()}.${fileType}`,
        Body: fileName.buffer
    }

    return imageParams
}

module.exports = params;