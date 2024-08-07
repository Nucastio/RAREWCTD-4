import { RxCross2 } from "react-icons/rx";

import { useAppStore } from "~/store/app";

const CloseButton = () => {

    const { setModal, modal: { state } } = useAppStore();

    return (
        <div
            className={`group flex cursor-pointer items-center justify-center rounded-full border-2 bg-[#E4E4E4] p-1 transition-all duration-300 ${state === "LOADING" ? "bg-[#D7D7D7]/90 hover:cursor-not-allowed border-transparent text-black/40" : "border-red-600  hover:bg-red-600"}`}
            onClick={() => {
                if(!(state === "LOADING")){
                    setModal(null)
                }
            }}
        >
            <div 
                className={`z-[3] rounded-full bg-[#D7D7D7] p-3 transition-all duration-300 ${!(state === "LOADING") && "group-hover:translate-x-[80px] group-hover:rotate-[360deg] group-hover:bg-white group-hover:text-black"}`}
            >
                <RxCross2 className="stroke-[1.5px]" />
            </div>
            <div
                className={`font-inter font-medium px-4 tracking-wider transition-all duration-300 ${!(state === "LOADING") && "group-hover:-translate-x-[40px]"} text-black group-hover:text-white ${state === "LOADING" && "group-hover:!text-black"} `}
            >
                Close
            </div>
        </div>
    );
};

export default CloseButton;