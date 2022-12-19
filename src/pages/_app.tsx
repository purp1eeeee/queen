import { ChakraProvider } from "@chakra-ui/react"
import type { AppProps } from "next/app"
import { AuthProvider } from "../providers/auth"

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <ChakraProvider resetCSS>
                <Component {...pageProps} />
            </ChakraProvider>
        </AuthProvider>
    )
}
