import { type Request, type Response } from "express";
import { z } from "zod";
import { ConversationSessionModel } from "../models/ConversationSession";
import supabase from "../supabase/db";
import axios from "axios";

function getSessionSchema() {
  return z.object({
    movie_id: z.string({ required_error: "Movie Id cant be empty" }),
    wallet_address: z.string({ required_error: "Wallet Address is required" }),
    character_id: z.string({ required_error: "Character Id is required" }),
  });
}

export const createSession = async (req: Request, res: Response) => {
  try {
    const sessionInfo = getSessionSchema().safeParse(req.body);

    if (!sessionInfo.success)
      throw { status: 400, message: sessionInfo.error.issues[0].message };

    const { count, error } = await supabase
      .from("feeded_indexes")
      .select("index_id", { count: "exact", head: true })
      .eq("movie_id", sessionInfo.data.movie_id);

    const query = supabase.from("feeded_indexes").select("index_id");

    if (count && count > 0) {
      query.eq("movie_id", sessionInfo.data.movie_id);
    } else {
      query.eq("book_id", sessionInfo.data.movie_id);
    }

    const { data: indexIdByMovieId, error: indexError } =
      await query.maybeSingle();

    if (!indexIdByMovieId) throw { status: 400, message: indexError?.message };

    const session_id = await ConversationSessionModel.insert({
      character_id: sessionInfo.data.character_id,
      index_id: indexIdByMovieId?.index_id,
    });

    res.status(200).json({
      message: "Session Created",
      session_id,
    });
  } catch (err: any) {
    res
      .status(err.status || 400)
      .json({ message: err.message || err || "ERROR" });
  }
};
