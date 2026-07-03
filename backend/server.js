
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";
import imageRoutes from "./routes/imageRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/image", imageRoutes);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL && process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export const handler = serverless(app);
export default handler;