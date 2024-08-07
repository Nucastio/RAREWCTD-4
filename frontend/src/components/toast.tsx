import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export const Toast = () => {
    return (
        <ToastContainer
            position="top-center"
            autoClose={3500}
            hideProgressBar={false}
            limit={4}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastStyle={{
                fontSize: "16px",
                letterSpacing: "1px",
            }}
            className={"font-inter font-medium"}
        />
    );
};