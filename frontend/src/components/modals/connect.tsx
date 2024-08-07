import { useMemo, useState } from "react";
import { BrowserWallet,type AssetExtended } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import Image from "next/image";

import { SUPPORTED_WALLETS, WALLETS } from "~/constants";
import { useAppStore } from "~/store/app";
import { useWalletStore } from "~/store/wallet";
import { error, success, wallet_status } from "~/utils";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useWeb3Modal } from "@web3modal/wagmi/react";

export function ConnectWalletModal() {
  return (
    <>
      <div className="relative flex max-w-[300px] flex-col gap-2 border border-[#000]/30 bg-primary p-[5px] pt-10 md:max-w-[500px]">
        <div
          className={`text-center font-inter text-lg font-bold uppercase leading-6 tracking-wider md:text-[20px] `}
        >
          CONNECT WALLET
        </div>

        <div className="flex w-full items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="502"
            height="2"
            viewBox="0 0 502 2"
            fill="none"
          >
            <path
              d="M0 1L502 1.00004"
              stroke="url(#paint0_linear_319_4266)"
              stroke-opacity="0.14"
            />
            <defs>
              <linearGradient
                id="paint0_linear_319_4266"
                x1="502.458"
                y1="43.9987"
                x2="77.0796"
                y2="-9.02559"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" stop-opacity="0.14" />
                <stop offset="0.781953" stop-color="white" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="wallet-grid  relative grid w-full grid-flow-col grid-rows-2 gap-0 overflow-x-scroll px-0 py-0 md:py-2">
          <ConnectButton />
          <Wallets />
        </div>
      </div>
    </>
  );
}

function ConnectButton() {
  const { open } = useWeb3Modal()

  const handleConnectWallet = async () => {
    try {
      await open()
    } catch (error) {
      console.error('Failed to connect wallet', error);
    }
  };

  return (
    <div
      key={"wallet-connect"}
      onClick={() => handleConnectWallet()}
      className={`flex items-center justify-center border-dashed border-[#4c4c4c] md:p-2 cursor-pointer`}
    >
      <div
        className={`text-center flex h-[100px] w-[100px] flex-col items-center justify-center gap-2 p-0 transition-all duration-300 hover:bg-[#E0E0E0] md:h-[140px] md:w-[140px] md:p-10`}
      >
        <div className="h-10 w-10 md:h-full md:min-h-[60px] md:w-full ">
          <Image
            loader={({ src }) => src}
            src={"https://walletconnect.com/static/favicon.png"}
            width={80}
            height={80}
            alt="Wallet Connect"
          />
        </div>
        Wallet Connect
      </div>
    </div>
  );

}

const available_wallet_sort = (
  supported: string,
  avail: string,
  available_wallets: string[],
) => {
  const indexA = available_wallets.indexOf(supported);
  const indexB = available_wallets.indexOf(avail);
  return indexA - indexB;
};

export const Wallets = () => {
  const available_wallets: string[] = useMemo(
    () => [
      ...BrowserWallet.getInstalledWallets().map((w: { name: string }) =>
        w.name.toLowerCase(),
      ),
    ],
    [],
  );

  const { connect, name } = useWallet();
  const { setWallet, setIsLoading, saveAccount } = useWalletStore();
  const { setModal } = useAppStore();
  const [loading, setLoading] = useState<string | null>(null);

  const pathname = usePathname();

  const { push } = useRouter();

  const onConnect = (w: string) => {
    if (!available_wallets.includes(w)) {
      return;
    }

    setIsLoading(true);
    localStorage.setItem("wallet_name", w);
    connect(w)
      .then(async () => {
        setLoading(w);

        const wallet = await BrowserWallet.enable(w);

        const stake_address = (await wallet.getRewardAddresses())[0];

        const assets = (await wallet.getAssets()) as AssetExtended[];

        saveAccount({
          stake_address,
          assets: [...new Set(assets.map((asset) => asset.policyId))],
        });

        setWallet(w);
        setModal(null);
        success(`${wallet_status.success} ${WALLETS[w]?.title}`);

        if (pathname === "/") void push("/explore");

        setLoading(null);
      })
      .catch((err) => {
        error(`${wallet_status.error} ${WALLETS[w]?.title}. ${err}`);
        setIsLoading(false);
      });

    setIsLoading(false);
  };

  return (
    <>
      {SUPPORTED_WALLETS.sort((a, b) =>
        available_wallet_sort(b, a, available_wallets),
      ).map((wallet) => (
        <div
          key={wallet}
          onClick={() => void onConnect(wallet)}
          className={`flex items-center justify-center border-dashed border-[#4c4c4c] p-1 md:p-2 ${available_wallets.includes(wallet) ? "cursor-pointer" : "opacity-50"}`}
        >
          <div
            className={`flex h-[100px] w-[100px] flex-col items-center justify-center gap-2 p-0 transition-all duration-300 hover:bg-[#E0E0E0] md:h-[140px] md:w-[140px] md:p-10 ${wallet === name && "border-[1px] border-black/50"}`}
          >
            <div className="h-10 w-10 md:h-full md:min-h-[60px] md:w-full ">
              <Image
                src={WALLETS[wallet]?.image ?? ""}
                width={80}
                height={80}
                alt="Eternl"
              />
            </div>
            {loading === wallet ? "Loading..." : WALLETS[wallet]?.title}
          </div>
        </div>
      ))}
    </>
  );
};
