import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import createSessionRoutes from "./routers/create-session";
import chatRoutes from "./routers/chat";
import characterRoutes from "./routers/character";
import uploadToIpfsRoutes from "./routers/upload-to-ipfs";
import { deployContract } from "./controllers/deployContract.controller";
import { mintHandler } from "./controllers/mintTo.controller";

const app = express();

app.use(express.json({ limit: '1gb' ,}));
app.use(cookieParser());
app.use(cors({
  origin: "*"
}));

app.use("/api/create-session", createSessionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/characters", characterRoutes);

app.use("/api/deployContract", deployContract);
app.use("/api/mintTo", mintHandler);
app.use("/api/uploadToIpfs", uploadToIpfsRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "SUCCESS" });
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
