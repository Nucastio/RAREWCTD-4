import { Router } from "express";
import { getCharacters } from "../controllers/characters";

const router = Router();

router.get("/:movie_id", getCharacters);

export default router;
