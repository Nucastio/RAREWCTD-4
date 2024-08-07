import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { Loader } from "./loader";

import { useWalletStore } from "~/store/wallet";
import supabase from "~/utils/supabase/supabase";

async function getMovies() {
    try {
        const { data: movies, error } = await supabase
            .from("movies")
            .select("*")
            .eq("live", true)
            .eq("aiEnabled", true);
        const { data: books } = await supabase
            .from("books")
            .select("*")
            .eq("live", true)
            .eq("aiEnabled", true);
        if (error ?? !books) throw error;
        return [...movies, ...books];
    } catch (error) {
        console.error(error);
    }
}

const Explore: React.FC = (): React.ReactNode => {
    const router = useRouter();
    const { connected_wallet, isLoading, setIsLoading, account } =
        useWalletStore();

    useEffect(() => {
        setIsLoading(true);
        if (!connected_wallet) {
            void router.push("/");
        }
        setIsLoading(false);
    }, [connected_wallet]);

    const { isLoading: isLoadingMovies, data: pageData } = useQuery({
        queryFn: () => getMovies(),
        queryKey: ["movies"],
    });

    const holdings = useMemo(
        () =>
            pageData
                ? pageData.filter((movie) =>
                    movie.policy_id?.find((p) => account?.assets.includes(p)),
                )
                : null,
        [pageData],
    );

    return isLoading || isLoadingMovies ? (
        <Loader />
    ) : (
        <section className="relative flex w-full flex-col items-center justify-center ">
            <div className=" flex w-full flex-col items-center justify-center pb-10 ">
                <div className="font-poppins text-base font-semibold tracking-wide text-tertiary">
                    Your library
                </div>

                <div>
                    {holdings && account && holdings.length > 0 ? (
                        <div className="mt-9 grid w-full grid-cols-2 gap-6 md:mt-14 md:grid-cols-3 md:gap-[50px] lg:grid-cols-4">
                            {holdings?.map((b) => (
                                <Link
                                    href={`/chat/${b.movie_id}`}
                                    className="flex w-full flex-col justify-between overflow-hidden bg-primary"
                                    key={b.id}
                                >
                                    <div className="h-full flex-1">
                                        <Image
                                            loader={({ src }) => src}
                                            src={b.poster_url ?? ""}
                                            width={1000}
                                            height={1000}
                                            className="h-full w-full object-cover"
                                            alt={b.title ?? ""}
                                        />
                                    </div>
                                    <div className="px-3 py-4 font-inter font-bold uppercase text-sm leading-[16px] tracking-tight ">
                                        {b.title ?? ""}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <ExploreMovies />
                    )}
                </div>
            </div>
        </section>
    );
};

export default Explore;

function ExploreMovies() {
    return (
        <div className="flex max-w-[600px] flex-col items-center justify-center bg-primary px-[24px] py-[30px] mt-5 md:px-[48px]">

            <div className=" text-center text-sm leading-[1.2] tracking-wider md:text-base font-bold font-inter">
                No NFTs found
            </div>

        </div>
    );
}