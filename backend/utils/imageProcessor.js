import axios from "axios";
import sharp from "sharp";
import fs from "fs";

export const generatePassportSheet = async (imageUrl, outputPath) => {
  const width = 300;
  const height = 400;

  // 1. Download image from Cloudinary
  const response = await axios({
    url: imageUrl,
    responseType: "arraybuffer",
  });

  const buffer = Buffer.from(response.data);

  // 2. Process image (IMPORTANT FIX HERE)
  const single = await sharp(buffer)
    .resize(width, height, {
      fit: "cover",   // fills frame properly (passport style)
      position: "center"
    })
    .removeAlpha()    // removes transparency if any
    .flatten({ background: "#ffffff" }) //  forces white background effect
    .sharpen()        // makes image clearer
    .toBuffer();

  // 3. Create 12 copies layout
  const images = [];

  for (let i = 0; i < 12; i++) {
    images.push({
      input: single,
      top: Math.floor(i / 3) * height,
      left: (i % 3) * width,
    });
  }

  // 4. Create white sheet
  await sharp({
    create: {
      width: width * 3,
      height: height * 4,
      channels: 3,
      background: "#ffffff",
    },
  })
    .composite(images)
    .toFile(outputPath);

  return outputPath;
};

