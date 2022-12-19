import { Auth, ThemeSupa } from "@supabase/auth-ui-react"
import { Typography, Button } from "@supabase/ui"
import { supabase } from "../libs/supabase"

const Container = (props: any) => {
    const { user } = Auth.useUser()
    if (user)
        return (
            <>
                <Typography.Text>Signed in: {user.email}</Typography.Text>
                <Button
                    block
                    onClick={() => props.supabaseClient.auth.signOut()}
                >
                    Sign out
                </Button>
            </>
        )
    return props.children
}

export const AuthBasic = () => {
    return (
        <div style={{ maxWidth: 400, margin: "0 auto", marginTop: 250 }}>
            <Container supabaseClient={supabase}>
                <Auth
                    supabaseClient={supabase}
                    providers={["google"]}
                    appearance={{ theme: ThemeSupa }}
                    onlyThirdPartyProviders
                />
            </Container>
        </div>
    )
}
