const { UploadVideo } = require("../utils/cloudinary");

const handleVideoUpload = async (req, res) => {
  try {
    const { video } = req.body;

    if (!video) {
      return res.status(400).json({
        success: false,
        message: "Video is required",
      });
    }

    const result = await UploadVideo(video);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Video upload error:", error);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

module.exports = { handleVideoUpload };
