import Head from "next/head";

import Chat from "~/components/chat";
import Layout from "~/layout";

export default function Index() {
    return (
        <>

            <Layout>
                <Chat />
            </Layout>
        </>
    );
}
