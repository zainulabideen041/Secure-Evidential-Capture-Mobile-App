const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new multer.memoryStorage();

async function UploadImage(file) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      folder: "screenshots",
    });
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}

async function UploadVideo(file) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "video",
      folder: "recorded_videos",
    });
    return result;
  } catch (error) {
    console.error("Cloudinary video upload error:", error);
    throw error;
  }
}

async function DeleteImage(cloudinaryId) {
  try {
    await cloudinary.uploader.destroy(cloudinaryId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

module.exports = { upload, UploadImage, UploadVideo, DeleteImage };
