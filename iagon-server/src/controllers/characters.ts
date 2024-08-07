import { type Request, type Response } from "express";
import supabase from "../supabase/db";

export const getCharacters = async (req: Request, res: Response) => {
  try {
    const { movie_id } = req.params;
    if (!movie_id) throw Error("No Movie Id Provided");

    const { count } = await supabase
      .from("feeded_indexes")
      .select("index_id", { count: "exact", head: true })
      .eq("movie_id", movie_id);

    const query = supabase.from("feeded_indexes").select("index_id");

    if (count && count > 0) {
      query.eq("movie_id", movie_id);
    } else {
      query.eq("book_id", movie_id);
    }

    const { data, error: indexError } = await query.maybeSingle();

    if (!data?.index_id) {
      throw Error("No Index Id Found");
    }

    const { data: characters, error } = await supabase
      .from("indexes_characters")
      .select("character_name, character_image, character_id")
      .eq("index_id", data?.index_id)
      .eq("live", true);

    if (error) {
      throw error;
    }
    res
      .status(200)
      .json({
        characters: characters.sort((a, b) =>
          a.character_name === "Default"
            ? -1
            : b.character_name === "Default"
            ? 1
            : 0
        ),
      });
  } catch (err: any) {
    res
      .status(err.status || 400)
      .json({ message: err.message || err || "ERROR" });
  }
};
