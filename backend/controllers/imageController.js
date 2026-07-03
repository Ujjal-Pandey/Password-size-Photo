
import cloudinary from "../config/cloudinary.js";
import { generatePassportSheet } from "../utils/imageProcessor.js";
import os from "os";
import path from "path";
import fs from "fs";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file?.buffer?.length) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const outputDir = os.tmpdir();
    const outputPath = path.join(outputDir, `result-${Date.now()}.jpg`);

    await fs.promises.mkdir(outputDir, { recursive: true });
    await generatePassportSheet(req.file.buffer, outputPath);

    const result = await cloudinary.uploader.upload(outputPath, {
      folder: "passport_results",
    });

    await fs.promises.unlink(outputPath).catch(() => {});

    return res.json({
      message: "Processed successfully",
      original: req.file.originalname || "uploaded-image",
      final: result.secure_url,
    });
  } catch (err) {
    console.error("Upload failed:", err);
    return res.status(err.statusCode || 500).json({ error: err.message || "Upload failed" });
  }
};

