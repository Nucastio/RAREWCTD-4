import CloseButton from "./close-btn";
import { ConnectWalletModal } from "./connect";
import { Loader } from "./loader";

import { useAppStore } from "~/store/app";
import Upload from "./upload";
import TokenInfo from "./token-info";

const Modals = {
    CONNECT_WALLET: ConnectWalletModal,
    LOADING: Loader,
    UPLOAD:Upload,
    TOKEN_INFO:TokenInfo
}

const Modal = () => {

    const { modal: { state } } = useAppStore();

    if (state) {

        const Child = Modals[state];

        return (
            <div className="fixed top-0 left-0 h-screen w-screen backdrop-blur-lg bg-black/40 z-[50] p-6">
                <div className="flex justify-start md:justify-center items-center h-full w-full flex-col gap-4">
                    <CloseButton />
                    <Child />
                </div>
            </div>
        );
    }

};

export default Modal;