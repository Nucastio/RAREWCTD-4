import { type Config } from "tailwindcss";

export default {
    content: ["./src/**/*.tsx"],
    plugins: [],
    theme: {
        extend: {
            colors: {
                // primary: "#F1F0E6",
                primary: "#d1d5db",
                secondary: "#000000",
                tertiary: "#676767",
            },
            fontFamily: {
                "poppins": ["var(--font-poppins)"],
                "inter": ["var(--font-inter)"],
            },
        },
    },
} satisfies Config;
