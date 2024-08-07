import Button from "./button";

import { useAppStore } from "~/store/app";
import { useWalletStore } from "~/store/wallet";

const Home: React.FC = (): React.ReactNode => {

  return (
    <section className="relative flex h-screen md:h-full w-full flex-col items-center justify-center ">
      <div className="flex max-w-[600px] flex-col items-center justify-center bg-primary px-[24px] py-[30px] md:mt-[124px] md:px-[48px] md:py-[67px]">
        <ConnectWallet />
      </div>
    </section>
  );
};

export default Home;

function ConnectWallet() {
  const { setModal } = useAppStore();

  return (
    <>

      <Button
        className="group relative flex items-center justify-center gap-4 px-4 md:px-10 rounded-none"
        // onClick={() => setModal("CONNECT_WALLET")}
        onClick={() => setModal("UPLOAD")}
      >
        <div className="relative text-sm md:text-base text-white group-hover:text-black ">Create Media Token</div>
      </Button>
    </>
  );
}
