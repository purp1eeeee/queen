import { ChakraProvider } from "@chakra-ui/react"
import type { AppProps } from "next/app"
import Head from "next/head"
import { AuthProvider } from "../providers/auth"

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>queen</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <AuthProvider>
                <ChakraProvider resetCSS>
                    <Component {...pageProps} />
                </ChakraProvider>
            </AuthProvider>
        </>
    )
}
