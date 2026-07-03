
import cloudinary from "../config/cloudinary.js";
import { generatePassportSheet } from "../utils/imageProcessor.js";
import os from "os";
import path from "path";
import fs from "fs";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file?.path) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imageUrl = req.file.path;
    const outputDir = os.tmpdir();
    const outputPath = path.join(outputDir, `result-${Date.now()}.jpg`);

    await fs.promises.mkdir(outputDir, { recursive: true });
    await generatePassportSheet(imageUrl, outputPath);

    const result = await cloudinary.uploader.upload(outputPath, {
      folder: "passport_results",
    });

    await fs.promises.unlink(outputPath).catch(() => {});

    res.json({
      message: "Processed successfully",
      original: imageUrl,
      final: result.secure_url,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

