import { Router } from "express";
import UploadToIPFS from "../controllers/uploadToIPFS";

const router = Router();

router.post("/", UploadToIPFS);

export default router;
