import { Poppins, Inter } from "next/font/google";
import Head from "next/head";
import { usePathname } from "next/navigation";

import Modals from "~/components/modals";
import Navbar from "~/components/navbar";
import { Toast } from "~/components/toast";

const poppins_font = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
});
const inter_font = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <>
      <Head>
        <title>Crosschain AI-Enabled Content Assets</title>

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Crosschain AI-Enabled Content Assets" />

        <meta
          property="og:image"
          content="https://opengraph.b-cdn.net/production/documents/5677c471-e6b0-45ba-9ee1-358c241493d7.png?token=9P0--rexV_-WUw0hrn_sxGwRyV0rCKd545t5XjqqmVY&height=675&width=1200&expires=33246767980"
        />

        <meta name="twitter:title" content="Crosschain AI-Enabled Content Assets" />
      </Head>
      <main
        className={`relative min-h-screen w-full bg-[#ffffff] text-secondary ${poppins_font.variable} ${inter_font.variable}`}
      >
        <Navbar isChatPage={pathname?.includes("/chat")} />
        <div className="mx-auto flex h-full w-[90%] flex-col items-center justify-center md:w-[87.5%] ">
          {children}
        </div>
        <Modals />
        <Toast />
      </main>
    </>
  );
};

export default Layout;
