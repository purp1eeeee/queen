import { Center, ChakraProvider, Spinner } from "@chakra-ui/react"
import type { AppProps } from "next/app"
import AuthBasic from "./auth"
import { Session } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import { supabase } from "../libs/supabase"

export default function App({ Component, pageProps }: AppProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [session, setSession] = useState<Session | null>()
    useEffect(() => {
        ;(async () => {
            const { data } = await supabase.auth.getSession()
            setSession(data.session)
            setIsLoading(false)
        })()
    }, [])

    return (
        <ChakraProvider resetCSS>
            {isLoading ? (
                <Center h="100vh">
                    <Spinner size="xl" />
                </Center>
            ) : session ? (
                <Component {...pageProps} />
            ) : (
                <AuthBasic />
            )}
        </ChakraProvider>
    )
}
