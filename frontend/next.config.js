await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,

    i18n: {
        locales: ["en"],
        defaultLocale: "en",
    },

    typescript: {
        ignoreBuildErrors: process.env.NEXT_PUBLIC_NODE_ENV !== 'development',
    },
    eslint: {
        ignoreDuringBuilds: process.env.NEXT_PUBLIC_NODE_ENV !== 'development',
    },

    swcMinify: true,

    images: {
        remotePatterns: [
            {
                hostname: "server.nucast.io",
            },
            {
                hostname: "ticketingserver.nucast.io",
            },
            {
                hostname: "nfyhwfevgqgzcgjyaovh.supabase.co",
            },
            {
                hostname: "qph.cf2.quoracdn.net",
            },
            {
                hostname: "converted-media.jpgstoreapis.com"
            }
        ],
    },

    webpack: function (config, options) {
        config.experiments = {
            asyncWebAssembly: true,
            layers: true,
        };
        return config;
    },
};

export default config;
