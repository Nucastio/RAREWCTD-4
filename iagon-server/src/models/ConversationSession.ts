import supabase from "../supabase/db";

interface ConversationSession {
  id: number;
  created_at: Date;
  session_id: string;
  character_id: string;
  index_id: string;
}

class ConversationSessionModel {
  private id: number;
  private created_at: Date;
  private session_id: string;
  private character_id: string;
  private index_id: string;
  constructor({
    id,
    created_at,
    session_id,
    character_id,
    index_id,
  }: ConversationSession) {
    this.id = id;
    this.created_at = created_at;
    this.session_id = session_id;
    this.character_id = character_id;
    this.index_id = index_id;
  }
  static async insert({
    character_id,
    index_id,
  }: {
    character_id: string;
    index_id: string;
  }): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from("conversation_sessions")
        .insert({
          character_id,
          index_id,
        })
        .select()
        .single();
      if (error) throw error;
      return data.session_id;
    } catch (err: any) {
      console.log(err);
      return err;
    }
  }
}
export { ConversationSessionModel };
