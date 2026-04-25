
import cloudinary from "../config/cloudinary.js";
import { generatePassportSheet } from "../utils/imageProcessor.js";


 export const uploadImage = async (req, res) => {
  try {
    // Cloudinary image URL
    const imageUrl = req.file.path;

    // Download & process locally (temporary)
    const outputPath = "output/result-" + Date.now() + ".jpg";

    await generatePassportSheet(imageUrl, outputPath);

    // Upload final image again to Cloudinary
    const result = await cloudinary.uploader.upload(outputPath, {
      folder: "passport_results"
    });

    res.json({
      message: "Processed successfully",
      original: imageUrl,
      final: result.secure_url
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

