import { type Request, type Response } from "express";
import { z } from "zod";
import supabase from "../supabase/db";
import axios from "axios";

function getChatBodySchema() {
  return z.object({
    session_id: z.string({ required_error: "Session Id is required" }),
    wallet_address: z.string({ required_error: "Wallet Address is required" }),
    user_query: z.string({ required_error: "User Query is required" }),
  });
}

export const createChat = async (req: Request, res: Response) => {
  try {
    const chatReqBody = getChatBodySchema().safeParse(req.body);

    if (!chatReqBody.success)
      throw { status: 400, message: chatReqBody.error.issues[0].message };

    const { data: logs } = await supabase
      .from("conversation_log")
      .select("*")
      .eq("session_id", chatReqBody.data.session_id);

    if (!logs) return;

    const userMessages = logs.filter((msg) => msg.sender === "User");
    const aiMessages = logs.filter((msg) => msg.sender === "AI");

    const sortedMessages = [];
    const maxLength = Math.max(userMessages.length, aiMessages.length);
    for (let i = 0; i < maxLength; i++) {
      if (i < userMessages.length) sortedMessages.push(userMessages[i]);
      if (i < aiMessages.length) sortedMessages.push(aiMessages[i]);
    }

    console.log(sortedMessages);

    const history: [string, string][] = [];

    let index = 0;
    while (index < sortedMessages.length) {
      history.push([
        sortedMessages[index]?.message ?? "",
        sortedMessages[index + 1]?.message ?? "",
      ]);

      index += 2;
    }

    console.log(history);

    const { data: session_data } = await supabase
      .from("conversation_sessions")
      .select("index_id, character_id")
      .eq("session_id", chatReqBody.data.session_id)
      .maybeSingle();

    const { data: character_data } = await supabase
      .from("indexes_characters")
      .select("prompt_template")
      .eq("character_id", session_data?.character_id ?? "")
      .maybeSingle();

    console.log({
      question: chatReqBody.data.user_query,
      index_id: session_data?.index_id,
      history: JSON.stringify(history),
      prompt_template: character_data?.prompt_template,
    })

    const { data } = await axios.post<{
      answer: string;
    }>(`${process.env.NUCAST_AI_API_URL}/ask`, {
      question: chatReqBody.data.user_query,
      index_id: session_data?.index_id,
      history: JSON.stringify(history),
      prompt_template: character_data?.prompt_template,
    });

    await supabase.from("conversation_log").insert([
      {
        message: chatReqBody.data.user_query,
        session_id: chatReqBody.data.session_id,
        sender: "User",
        wallet_address: chatReqBody.data.wallet_address,
      },
      {
        message: data.answer,
        session_id: chatReqBody.data.session_id,
        sender: "AI",
      },
    ]);

    res.status(200).json({ message: "SUCCESS", ...data });
  } catch (err: any) {
    res
      .status(err.status || 400)
      .json({ message: err.message || err || "ERROR" });
  }
};
