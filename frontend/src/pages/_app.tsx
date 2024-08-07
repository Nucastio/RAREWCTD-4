import { useEffect } from "react";
import { MeshProvider } from "@meshsdk/react";
import Lenis from "@studio-freight/lenis";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type AppType } from "next/dist/shared/lib/utils";

import "~/styles/globals.css";

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet, wanchainTestnet } from 'wagmi/chains'

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT as string

const chains = [wanchainTestnet] as const

const metadata = {
    name: 'Crosschain AI-Enabled Content Assets',
    description: "Crosschain AI-Enabled Content Assets",
    url: '',
    icons: ['']
}

const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
})

createWeb3Modal({
    metadata,
    wagmiConfig,
    projectId,
    enableAnalytics: true
})


const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
    useEffect(() => {
        const lenis = new Lenis();

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => lenis.destroy();
    }, []);

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <MeshProvider>
                    <Component {...pageProps} />
                </MeshProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export default MyApp;
