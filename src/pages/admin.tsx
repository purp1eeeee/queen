import {
    Box,
    Button,
    ButtonGroup,
    Center,
    Input,
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
    getGameStatus,
    getResultByEmail,
    postGameStatus,
    updateQuestionPosition,
} from "../libs/supabase"

const STATUS = [0, 1, 2] as const
type STATUS = typeof STATUS[number]

const toStr = (s: STATUS): string => {
    switch (s) {
        case 0:
            return "準備中"
        case 1:
            return "進行中"
        case 2:
            return "終了"
    }
}

const Page = () => {
    const router = useRouter()
    const { me } = useAuth()

    const [status, setStatus] = useState<STATUS>(0)

    const [questionId, setCurrentQuestionId] = useState<number | undefined>(
        undefined
    )

    const [result, setResult] = useState<Record<string, number>>({})

    const [email, setEmail] = useState("")

    useEffect(() => {
        ;(async () => {
            const r = await getGameStatus()
            setStatus(r.status as STATUS)
        })()
    }, [])

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

    const onClickStatus = async (s: STATUS) => {
        await postGameStatus(s)
        setStatus(s)
    }

    if (!questionId) {
        return (
            <Center h="100vh">
                <Spinner size="xl" speed="0.65s" />
            </Center>
        )
    }

    return (
        <main>
            <VStack h="100vh" justifyContent="center" spacing="24">
                <Box>
                    <Text fontWeight="bold">Game Status</Text>
                    <Text>{toStr(status)}</Text>
                    <ButtonGroup>
                        <Button onClick={() => onClickStatus(0)}>ready</Button>
                        <Button onClick={() => onClickStatus(1)}>
                            progress
                        </Button>
                        <Button onClick={() => onClickStatus(2)}>finish</Button>
                    </ButtonGroup>
                </Box>
                <Box>
                    <Text fontWeight="bold">Question Status</Text>
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
                    <Text fontWeight="bold">get answer result!</Text>
                    <Button onClick={onClickResult}>get</Button>
                </Box>
                <Box>{JSON.stringify(result)}</Box>

                <Box>
                    <Text fontWeight="bold">get result by email</Text>
                    <Input
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                    />
                    <Button
                        onClick={async () => {
                            const a = await getResultByEmail(email)
                            console.log(a)
                        }}
                    >
                        get
                    </Button>
                </Box>
            </VStack>
        </main>
    )
}

export default Page
