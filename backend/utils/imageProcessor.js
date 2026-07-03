import axios from "axios";
import sharp from "sharp";

export const generatePassportSheet = async (imageInput, outputPath) => {
  const width = 300;
  const height = 400;

  let buffer;

  if (Buffer.isBuffer(imageInput)) {
    buffer = imageInput;
  } else {
    const response = await axios({
      url: imageInput,
      responseType: "arraybuffer",
    });

    buffer = Buffer.from(response.data);
  }

  if (!buffer?.length) {
    throw new Error("Image content is empty");
  }

  const single = await sharp(buffer)
    .resize(width, height, {
      fit: "cover",
      position: "center",
    })
    .removeAlpha()
    .flatten({ background: "#ffffff" })
    .sharpen()
    .toBuffer();

  const images = [];

  for (let i = 0; i < 12; i++) {
    images.push({
      input: single,
      top: Math.floor(i / 3) * height,
      left: (i % 3) * width,
    });
  }

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

