import { create } from "zustand";

import { type BookCharacterType, type BookType } from "~/types";

interface ChatStore {
  selected_book: BookType | null;
  setSelectedBook: (wallet: ChatStore["selected_book"]) => void;
  selected_character: BookCharacterType | null;
  setSelectedCharacter: (wallet: ChatStore["selected_character"]) => void;

  currentSession: string | null;
  setCurrentSession: (prop: string) => void;

  currentAIRole: "movie" | "book" | "character" | null;
  setCurrentAIRole: (prop: "movie" | "book" | "character" | null) => void;

  messages: {
    message: string;
    sender: "AI" | "User";
    name: string;
    image?: string;
    loading: boolean;
    id: number;
  }[];

  addMessage: (props: {
    message: string;
    sender: "AI" | "User";
    name: string;
    image?: string;
    loading: boolean;
    id: number;
  }) => void;

  resetMessages: () => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  characterLoading: boolean;
  setCharacterLoading: (characterLoading: boolean) => void;
}

export const useChatStore = create<ChatStore>()((set) => ({
  selected_book: null,
  selected_character: null,
  setSelectedBook: (book) => set(() => ({ selected_book: book })),
  setSelectedCharacter: (character) =>
    set(() => ({ selected_character: character })),

  currentSession: null,
  setCurrentSession(session) {
    set({
      currentSession: session,
    });
  },
  currentAIRole: null,
  setCurrentAIRole(session) {
    set({
      currentAIRole: session,
    });
  },
  messages: [],
  addMessage(props) {
    set((prev) => ({
      messages: [...prev.messages, props],
    }));
  },

  resetMessages() {
    set({
      messages: [],
      currentSession: null,
    });
  },
  loading: false,
  setLoading(loading) {
    set({
      loading,
    });
  },
  characterLoading: false,
  setCharacterLoading(characterLoading) {
    set({
      characterLoading,
    });
  },
}));
