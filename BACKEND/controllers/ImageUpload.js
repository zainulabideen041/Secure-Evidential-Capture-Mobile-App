const { UploadImage, DeleteImage } = require("../utils/cloudinary");

const handleImageUpload = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }
    const result = await UploadImage(image);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

const deleteUploadedImage = async (req, res) => {
  try {
    const cloudinaryId = req.body.cloudinaryId;
    const result = await DeleteImage(cloudinaryId);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

module.exports = { handleImageUpload, deleteUploadedImage };
