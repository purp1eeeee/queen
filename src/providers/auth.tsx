import { createContext, ReactNode, useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { getSession } from "../libs/supabase"
import { Center, Spinner } from "@chakra-ui/react"
import { AuthBasic } from "../components/auth"

type Auth = {
    me: User | null
}

export const AuthContext = createContext<Auth>({
    me: null,
})

type Props = {
    children: ReactNode
}

export const AuthProvider = (props: Props) => {
    const [me, setMe] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        ;(async () => {
            const { data } = await getSession()
            setMe(data.session?.user ?? null)
            setIsLoading(false)
        })()
    }, [])

    if (isLoading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" speed="0.65s" />
            </Center>
        )
    }
    return (
        <AuthContext.Provider value={{ me }}>
            {!me ? <AuthBasic /> : props.children}
        </AuthContext.Provider>
    )
}
