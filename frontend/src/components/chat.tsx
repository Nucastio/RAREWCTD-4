import { type MouseEvent, useEffect, useState, useRef, useMemo } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { PiCaretUpDown } from "react-icons/pi";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useClickOutside } from "~/hooks/use-click-outside";
import { useChatStore } from "~/store/chat";
import { type BookCharacterType } from "~/types";
import { getLogo } from "~/utils";
import supabase from "~/utils/supabase/supabase";
import { useRouter } from "next/router";
import axios from "axios";
import { useWalletStore } from "~/store/wallet";
import { BASE_API_URL } from "~/constants";
import { useWallet } from "@meshsdk/react";
import { toast } from "react-toastify";
import { useAppStore } from "~/store/app";
import SubLoader from "./modals/sub-loader";

async function getMovies() {
  try {
    const query = supabase
      .from("movies")
      .select("*")
      .eq("live", true)
      .eq("aiEnabled", true);

    const { data: movies, error } = await query;

    const { data: books } = await supabase
      .from("books")
      .select("*")
      .eq("live", true)
      .eq("aiEnabled", true);

    if (error ?? !books) throw error;
    return [...movies, ...books.map((book) => ({ ...book, book: true }))];
  } catch (error) {
    console.error(error);
  }
}

async function getMovieData(id: string | null) {
  try {
    if (!id) return null;

    const query = supabase
      .from("movies")
      .select("*")
      .eq("live", true)
      .eq("movie_id", id)
      .maybeSingle();

    const { data: movie } = await query;

    if (!movie) {
      console.log("executed");
      const query = supabase
        .from("books")
        .select("*")
        .eq("live", true)
        .eq("movie_id", id)
        .maybeSingle();

      const { data: movie } = await query;

      return { ...movie, book: true };
    }

    return { ...movie, book: false };
  } catch (error) {
    console.error(error);
  }
}

async function getMovieCharacters(id: string | null) {
  try {
    if (!id) return null;

    const { data } = await axios.get<{
      characters: {
        character_id: string;
        character_image: string;
        character_name: string;
      }[];
    }>(`${BASE_API_URL}/api/characters/${id}`);

    if (!data) throw Error("No character found");
    return data;
  } catch (error) {
    console.error(error);
  }
}

const Chat: React.FC = (): React.ReactNode => {
  const [openList, setOpenList] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const [pageLoading, setPageLoading] = useState(true);

  const [userQuery, setUserQuery] = useState("");

  const {
    selected_character,
    addMessage,
    currentSession,
    messages,
    setLoading,
    characterLoading,
    currentAIRole,
  } = useChatStore();

  const { account } = useWalletStore();

  const { connected } = useWallet();

  const handleClose = () => setOpenDrawer(false);
  const handleOpen = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    e.stopPropagation();
    setOpenDrawer(true);
  };

  const ref = useClickOutside<HTMLDivElement>(handleClose);

  const { query, push } = useRouter();

  const { data: selectedBook } = useQuery({
    queryFn: () => getMovieData(query.id as string),
    queryKey: ["movieData", query.id],
  });

  const { isLoading: charactersLoading, data: movieCharacters } = useQuery({
    queryFn: () => getMovieCharacters(query.id as string),
    queryKey: ["movie_characters", query.id],
  });

  console.log(movieCharacters)

  const { isLoading: isLoadingMovies, data: movies } = useQuery({
    queryFn: () => getMovies(),
    queryKey: ["movies"],
  });

  useEffect(() => {
    if (connected) {
      const assets = movies?.filter((movie) =>
        movie.policy_id?.some((id) => account?.assets.includes(id)),
      ).length;

      if (assets === 0) {
        void push("/");
        return;
      }

      setPageLoading(false);
    }
  }, []);

  const onChat = async () => {
    setLoading(true); // loading start
    try {
      setUserQuery(""); // input field blank after send

      if (!account?.stake_address || !selected_character) return;

      addMessage({
        loading: false,
        id: messages.length + 1,
        message: userQuery,
        name: "You",
        sender: "User",
      });

      const { data } = await axios.post<{
        answer: string;
      }>(`${BASE_API_URL}/api/chat`, {
        session_id: currentSession,
        wallet_address: account?.stake_address,
        user_query: userQuery,
      });

      addMessage({
        loading: false,
        id: messages.length + 1,
        message: data.answer,
        name: selected_character.name,
        sender: "AI",
        image: selected_character?.imgUrl ?? undefined,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={`absolute left-0 top-[65px] w-full md:top-[112px]`}>
      <div
        className={`flex h-[calc(100vh-65px)] w-full gap-5 p-2 md:h-[calc(100vh-125px)] lg:px-5 lg:py-3 `}
      >
        <Library />

        <motion.div
          className={`fixed left-0 top-0 z-[101] flex h-screen w-full flex-col justify-end overflow-y-scroll bg-[#EBCED8D6] md:hidden ${openDrawer ? "pointer-events-auto " : "pointer-events-none"} `}
          initial={{ opacity: 0 }}
          animate={{ opacity: openDrawer ? 1 : 0 }}
        >
          <motion.div
            className="relative rounded-t-[20px] bg-[#E7E7E7] pb-10 pt-8 "
            initial={{ y: "100vh" }}
            animate={{ y: openDrawer ? 0 : "100vh" }}
            transition={{
              damping: 33,
              // Adjust damping to reduce bounce
              stiffness: 500,
              type: "spring", // Adjust stiffness to control the speed
            }}
            ref={ref}
          >
            <div className="absolute left-1/2 top-2.5 h-1.5 w-[48px] -translate-x-1/2 rounded-full bg-[#D9D9D91A]" />
            <Library />
          </motion.div>
        </motion.div>

        {selectedBook && (
          <div className="flex h-full max-h-full w-full flex-col items-center justify-center gap-5 overflow-auto border border-[#00000012] bg-primary p-3 md:px-9 md:pb-[20px] md:pt-6 [&::-webkit-scrollbar]:hidden">
            {characterLoading ? (
              <div className="h-full w-full items-center justify-center">
                <SubLoader />
              </div>
            ) : (
              !selected_character && (
                <div
                  className={`${selected_character ? "max-h-[40px] md:max-h-[120px]" : "max-h-[1000px]"} flex h-full w-full flex-1 flex-col items-center justify-center transition-all duration-200 `}
                >
                  <div
                    className={`font-poppins text-base font-bold tracking-wide text-tertiary ${selected_character ? "mb-0 max-h-0" : "mb-7 max-h-[1000px]"} overflow-hidden transition-all duration-200`}
                  >
                    You’re chatting with
                  </div>

                  <div
                    className={`${selected_character ? "mb-0 max-h-0 " : ""} overflow-hidden transition-all duration-200 md:mb-6 md:max-h-[1000px]`}
                  >
                    <Image
                      src={selectedBook?.poster_url ?? ""}
                      width={1000}
                      height={1000}
                      className={`h-auto ${selected_character ? "w-[50px]" : "w-[150px]"} object-contain transition-all duration-200 `}
                      alt={selectedBook.title ?? ""}
                    />
                  </div>
                  <button
                    className="flex cursor-pointer items-center gap-3 font-inter font-bold uppercase text-base tracking-tight text-secondary md:cursor-default"
                    onClick={handleOpen}
                  >
                    {selectedBook.title}
                    <div className="block md:hidden">
                      <PiCaretUpDown className="stroke-[8]" />
                    </div>
                  </button>
                </div>
              )
            )}

            <div
              className={`h-full flex-1 ${selected_character ? "max-h-[1000px]" : "max-h-0"} w-full overflow-hidden transition-all  duration-200 `}
            >
              <Messages />
            </div>

            <div className="flex w-full flex-col items-center justify-center md:max-w-[820px]">
              <div
                className={`flex w-full flex-col items-center justify-center ${selected_character ? "max-h-0" : "max-h-[1000px]"} overflow-hidden transition-all duration-200 `}
              >
                <div className="font-poppins text-xs font-semibold tracking-wide text-secondary">
                  Chat with characters
                </div>
                <div className="mt-5 w-full border border-[#D8D8D8] p-4">
                  {charactersLoading ? (
                    <SubLoader />
                  ) : (
                    <div
                      className="flex w-full  max-w-full items-center gap-10 overflow-auto [&::-webkit-scrollbar]:hidden"
                      data-lenis-prevent
                    >
                      {movieCharacters?.characters.map((c) => (
                          <DisplayCharacter
                            c={{
                              id: c.character_id,
                              imgUrl: c.character_image,
                              name: c.character_name,
                            }}
                          />
                        ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2.5 flex w-full items-center bg-gray-200 ">
                {selected_character && (
                  <div
                    className="relative flex cursor-pointer items-center gap-2.5 border-r border-[#D5D5D5] p-2.5 "
                    onClick={() => setOpenList((p) => !p)}
                  >
                    {selected_character.imgUrl ? (
                      <Image
                        src={selected_character.imgUrl}
                        width={1000}
                        height={1000}
                        className="h-8 w-8 object-cover object-top"
                        alt={selected_character.name}
                      />
                    ) : (
                      <GetLogo name={getLogo(selected_character.name)} />
                    )}
                    <div>
                      <IoIosArrowDown
                        className={`text-base text-tertiary md:text-xl ${openList ? "rotate-180" : "rotate-0"} transition-all duration-200`}
                      />
                    </div>

                    <div
                      className={`absolute bottom-[130%] left-0 min-w-[200px] md:bottom-[110%]  ${openList ? "max-h-[300px] overflow-auto [&::-webkit-scrollbar]:hidden" : "max-h-0 overflow-hidden"} bg-[#aaa]/50 backdrop-blur-md transition-all duration-200`}
                      data-lenis-prevent
                    >
                      {movieCharacters?.characters.map((c) => (
                          <div className="p-3">
                            <DisplayCharacter
                              c={{
                                imgUrl: c.character_image,
                                name: c.character_name,
                                id: c.character_id,
                              }}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                <input
                  type="text"
                  className="m-2.5 h-full w-full flex-1 bg-transparent pl-2 font-poppins text-xs text-secondary outline-none placeholder:text-tertiary disabled:cursor-not-allowed disabled:opacity-50 md:pl-5 md:text-base "
                  placeholder={
                    selected_character === null
                      ? "Select character to start chatting"
                      : "Start chatting"
                  }
                  value={userQuery}
                  disabled={selected_character === null}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void onChat();
                  }}
                />

                <button
                  onClick={() => onChat()}
                  disabled={selected_character === null}
                  className="ripple group m-2.5 ml-5  cursor-pointer bg-[#D1D1D0] p-2.5 transition-all duration-200 disabled:pointer-events-none disabled:opacity-50"
                >
                  <IoSend className="relative text-[24px] text-black/50 group-hover:text-black" />
                </button>
              </div>
              {currentAIRole && (
                <div className="w-full pt-4 text-center font-poppins text-sm opacity-40">
                  You are chatting with the {currentAIRole}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Chat;

function DisplayCharacter({ c }: { c: BookCharacterType }) {
  const { setSelectedCharacter } = useChatStore();

  const { query } = useRouter();

  const { account } = useWalletStore();
  const { setModal } = useAppStore();
  const {
    addMessage,
    setCurrentSession,
    messages,
    setCharacterLoading,
    setCurrentAIRole,
  } = useChatStore();

  const { connected } = useWallet();

  const { data: selectedBook } = useQuery({
    queryFn: () => getMovieData(query.id as string),
    queryKey: ["movieData", query.id],
  });

  const is_user_holding = useMemo(
    () =>
      !connected
        ? false
        : selectedBook?.policy_id
          ? !selectedBook?.policy_id.some((p) => account?.assets.includes(p))
          : true,
    [selectedBook, account?.assets, connected],
  );

  const onSelectCharacter = async (character: BookCharacterType) => {
    try {
      setCharacterLoading(true);

      if (!selectedBook?.policy_id) {
        setCharacterLoading(false);

        return;
      }

      if (!connected) {
        setCharacterLoading(false);

        setModal("CONNECT_WALLET");
        return;
      }

      const holding = selectedBook?.policy_id.find((p) =>
        account?.assets.includes(p),
      );

      if (!holding) {
        toast.error("Please buy the asset to interact with it!");
        setCharacterLoading(false);

        return;
      }

      const { data } = await axios.post<{
        message: string;
        session_id: string;
        answer: string;
      }>(`${BASE_API_URL}/api/create-session`, {
        movie_id: query.id,
        wallet_address: account?.stake_address,
        character_id: character.id,
      });

      setCurrentSession(data.session_id);

      setCurrentAIRole(
        selectedBook.book
          ? "book"
          : c.name === "Default"
            ? "movie"
            : "character",
      );

      if (c.name === "Default") {
        setSelectedCharacter({
          id: c.id,
          imgUrl: selectedBook?.poster_url ?? "",
          name: selectedBook?.title ?? "",
        });
      } else {
        setSelectedCharacter(c);
      }

      const { data: answer } = await axios.post<{
        answer: string;
      }>(`${BASE_API_URL}/api/chat`, {
        session_id: data.session_id,
        wallet_address: account?.stake_address,
        user_query: "Hello There",
      });

      if (c.name === "Default") {
        addMessage({
          loading: false,
          id: messages.length + 1,
          message: answer.answer,
          name: selectedBook?.title ?? "",
          sender: "AI",
          image: selectedBook?.poster_url ?? undefined,
        });
      } else {
        addMessage({
          loading: false,
          id: messages.length + 1,
          message: answer.answer,
          name: c?.name ?? "",
          sender: "AI",
          image: c?.imgUrl ?? undefined,
        });
      }

      setCharacterLoading(false);
    } catch (error) {
      setCharacterLoading(false);

      console.log(error);
    }
  };

  const characterData = useMemo(
    () => ({
      image: c.name === "Default" ? selectedBook?.poster_url : c.imgUrl,
      name: c.name === "Default" ? selectedBook?.title : c.name,
    }),
    [],
  );

  return (
    <button
      disabled={is_user_holding}
      className={`group flex min-w-max cursor-pointer items-center gap-3 ${is_user_holding && "cursor-not-allowed"}`}
      key={c.id}
      onClick={() => onSelectCharacter(c)}
    >
      <div className="h-[30px] overflow-hidden md:h-[50px] ">
        {characterData.image ? (
          <Image
            src={characterData.image}
            width={1000}
            height={1000}
            className="relative h-[30px] w-[30px] md:w-[50px] object-cover object-top transition-all duration-200 group-hover:scale-110 md:h-[50px]"
            alt={characterData.name ?? ""}
          />
        ) : (
          <GetLogo name={getLogo(characterData.name ?? "")} />
        )}
      </div>
      <div className="relative font-poppins text-xs capitalize tracking-wide text-[#161616] transition-all duration-200 group-hover:text-tertiary md:text-sm">
        {(characterData.name ?? "")?.toLowerCase()}
      </div>
    </button>
  );
}

function Messages() {
  const { messages, loading } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { selected_character } = useChatStore();

  return (
    <div
      className="h-full max-h-full w-full  overflow-auto  [&::-webkit-scrollbar]:hidden"
      data-lenis-prevent
    >
      <div className="flex w-full flex-col justify-end gap-5 py-6">
        {messages.map((m) => (
          <div
            className={`flex items-start gap-3 ${!(m.sender === "User") ? "row self-start" : "flex-row-reverse self-end"} `}
          >
            <div className="shrink-0">
              {m?.image ? (
                <Image
                  src={m.image}
                  width={1000}
                  height={1000}
                  className="relative h-[25px] w-[25px] md:w-[40px] object-cover transition-all duration-200 group-hover:scale-110 md:h-[40px]"
                  alt={m.name}
                />
              ) : (
                <GetLogo name={getLogo(m.name)} />
              )}
            </div>
            <div className="">
              {!(m.sender === "User") && (
                <div className="pb-2 font-poppins text-xs font-bold">
                  {m.name}
                </div>
              )}
              <div
                className={`w-full  md:w-auto md:max-w-[40vw] ${!(m.sender === "User") ? "bg-gray-200" : "bg-[#E5E5E5]"} px-4 py-5 font-poppins text-xs tracking-wider text-black md:text-sm`}
              >
                {!(m.sender === "User")
                  ? m.message.replace(/\n/g, "").replace("/n", "").replace(/^\w+:\s*/, "")
                  : m.message}
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>
      {loading ? (
        <div className={`row flex items-start gap-3 self-start`}>
          <div>
            {selected_character?.imgUrl ? (
              <Image
                src={selected_character?.imgUrl}
                width={1000}
                height={1000}
                className="relative h-[25px] w-[25px] md:w-[40px] object-cover transition-all duration-200 group-hover:scale-110 md:h-[40px]"
                alt={selected_character?.name}
              />
            ) : (
              <GetLogo name={selected_character?.name ?? ""} />
            )}
          </div>
          <div
            className={`w-full bg-gray-200 px-4 py-5 font-poppins text-xs tracking-wider text-black md:w-auto md:max-w-[40vw] md:text-sm`}
          >
            Thinking...
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

function Library() {
  const { isLoading: isLoadingMovies, data: pageData } = useQuery({
    queryFn: () => getMovies(),
    queryKey: ["movies"],
  });
  const { account } = useWalletStore();

  const { resetMessages, setSelectedCharacter, setSelectedBook } =
    useChatStore();

  const holdings = useMemo(
    () =>
      pageData
        ? pageData.filter((movie) =>
            movie.policy_id?.find((p) => account?.assets.includes(p)),
          )
        : null,
    [pageData, account?.assets],
  );

  if (holdings?.length === 0) return <></>;

  return (
    <>
      {isLoadingMovies ? (
        <div className="grid h-full w-[200px] place-items-center">
          <SubLoader white={true} />
        </div>
      ) : (
        <div className="hidden h-full w-full overflow-hidden border border-[#00000012] bg-gradient-to-b  from-[#E4E4E4C4] to-[#E4E4E440] py-12 pl-4 pr-8 md:block md:w-auto md:min-w-max md:max-w-[300px] ">
          <div className="border-b border-[#2B2B2C] px-7 pb-4 text-center font-poppins text-base font-semibold tracking-wide text-tertiary md:border-b-0 md:px-0 md:pb-0 md:text-left md:text-xs">
            Your library
          </div>
          <div
            className="pointer-events-auto mt-6 flex h-full flex-col items-start gap-5 overflow-y-scroll px-7 md:gap-6 md:px-0 [&::-webkit-scrollbar]:hidden"
            data-lenis-prevent
          >
            {holdings?.map((b) => (
              <Link
                onClick={() => {
                  resetMessages();
                  setSelectedCharacter(null);
                  setSelectedBook(null);
                }}
                href={`/chat/${b.movie_id}`}
                className="group flex w-full cursor-pointer items-center gap-3"
                key={b.id}
              >
                <div className="h-[50px] overflow-hidden">
                  <Image
                    loader={({ src }) => src}
                    src={b.poster_url ?? ""}
                    width={1000}
                    height={1000}
                    className="h-[60px] w-[60px] md:w-[50px] object-cover transition-all duration-200 group-hover:scale-110 md:h-[50px]"
                    alt={b.title ?? ""}
                  />
                </div>
                <div className="font-poppins text-sm capitalize tracking-wide text-[#161616] transition-all duration-200 group-hover:text-tertiary">
                  {(b.title ?? "").toLowerCase()}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function GetLogo({ name }: { name: string }) {
  return (
    <div className="bg-gray-500 h-[25px] w-[25px] md:w-[40px] md:h-[40px] grid place-items-center font-poppins text-sm font-bold text-white ">
      {name}
    </div>
  );
}
