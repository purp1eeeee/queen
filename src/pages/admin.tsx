import {
    Box,
    Button,
    ButtonGroup,
    Center,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import {
    getAllAnswerRanking,
    getCurrentQuestionId,
    updateQuestionPosition,
} from "../libs/supabase"

const Page = () => {
    const router = useRouter()
    const { me } = useAuth()

    const [questionId, setCurrentQuestionId] = useState<number | undefined>(
        undefined
    )

    const [result, setResult] = useState<Record<string, number>>({})

    useEffect(() => {
        ;(async () => {
            const currentQuestionId = await getCurrentQuestionId()
            setCurrentQuestionId(currentQuestionId)
        })()
    }, [])

    if (
        !me?.email?.includes("murasaki.haruki") &&
        !me?.email?.includes("tabe.kota")
    ) {
        router.push("/")
    }

    const onClickPrev = async () => {
        if (!questionId) return
        const v = questionId - 1
        await updateQuestionPosition(v)
        setCurrentQuestionId(v)
    }
    const onClickNext = async () => {
        if (!questionId) return
        const v = questionId + 1
        await updateQuestionPosition(v)
        setCurrentQuestionId(v)
    }

    const onClickResult = async () => {
        const r = await getAllAnswerRanking()
        setResult(r)
    }

    if (!questionId) {
        return (
            <Center h="100vh">
                <Spinner size="xl" />
            </Center>
        )
    }

    return (
        <main>
            <VStack h="100vh" justifyContent="center" spacing="24">
                <Box>
                    <Text>Game Status</Text>
                    <Text>hogehoge</Text>
                </Box>
                <Box>
                    <Text>Question Status</Text>
                    <Text>current: {questionId}</Text>
                    <ButtonGroup>
                        <Button
                            disabled={questionId <= 1}
                            onClick={onClickPrev}
                        >
                            prev
                        </Button>

                        <Button
                            disabled={questionId >= 8}
                            onClick={onClickNext}
                        >
                            next
                        </Button>
                    </ButtonGroup>
                </Box>
                <Box>
                    <Text>get answer result!</Text>
                    <Button onClick={onClickResult}>get</Button>
                </Box>
                <Box>{JSON.stringify(result)}</Box>
            </VStack>
        </main>
    )
}

export default Page
