import { Router } from "express";
import { createSession } from "../controllers/createSession";

const router = Router();

router.post("/", createSession);

export default router;
