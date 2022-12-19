import { Button, Flex, Spinner, Text, VStack } from "@chakra-ui/react"
import Head from "next/head"
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import {
    postAnswer,
    getQuestionPositionChannel,
    getCurrentQuestionId,
    checkIsAnsweredByEmailAndQuestionId,
    getResultByEmail,
    getGameStatusChannel,
    getGameStatus,
} from "../libs/supabase"

const ANSWER_VALUES = [1, 2, 3, 4] as const
type ANSWER_VALUES = typeof ANSWER_VALUES[number]

const toStr = (v: ANSWER_VALUES) => {
    switch (v) {
        case 1:
            return "A"
        case 2:
            return "B"
        case 3:
            return "C"
        case 4:
            return "D"
    }
}

export default function Home() {
    const [selectedValue, setSelectedValue] = useState<
        ANSWER_VALUES | undefined
    >(undefined)

    const [isAnswered, setIsAnswered] = useState(false)

    const [questionId, setCurrentQuestionId] = useState<number | undefined>(
        undefined
    )

    const [status, setStatus] = useState<0 | 1 | 2>(0)

    const [result, setResult] = useState({ total: 0, currect: 0 })

    const { me } = useAuth()

    useEffect(() => {
        ;(async () => {
            const currentQuestionId = await getCurrentQuestionId()
            setCurrentQuestionId(currentQuestionId)
        })()
    }, [])

    useEffect(() => {
        ;(async () => {
            const s = await getGameStatus()
            setStatus(s.status)
        })()
    }, [])

    useEffect(() => {
        ;(async () => {
            if (!me?.email) return
            if (!questionId) return
            const answered = await checkIsAnsweredByEmailAndQuestionId(
                me.email,
                questionId
            )
            if (answered) {
                setIsAnswered(true)
            }
        })()
    }, [me?.email, questionId])

    useEffect(() => {
        ;(async () => {
            if (!me?.email) return
            if (status === 2) {
                const r = await getResultByEmail(me.email)
                setResult(r)
            }
        })()
    }, [me?.email, status])

    useEffect(() => {
        const positionListener = getQuestionPositionChannel()

        positionListener
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "current_question_positions",
                },
                (payload) => {
                    setCurrentQuestionId(payload.new.current_question_id)
                    console.log(payload)
                    setIsAnswered(false)
                }
            )
            .subscribe()
        return () => {
            positionListener.unsubscribe()
        }
    }, [])

    useEffect(() => {
        const listener = getGameStatusChannel()

        listener
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "game_status",
                },
                (payload) => {
                    setStatus(payload.new.status)
                    console.log(payload)
                }
            )
            .subscribe()
        return () => {
            listener.unsubscribe()
        }
    }, [])

    const onClickValue = (value: ANSWER_VALUES) => {
        setSelectedValue(value)
    }

    const onClickSubmit = async () => {
        if (!selectedValue) {
            return
        }
        if (!me?.email) {
            return
        }
        if (!questionId) {
            return
        }
        await postAnswer({
            questionId: questionId,
            emailAddress: me.email,
            answerValue: selectedValue,
        })

        setIsAnswered(true)
    }

    if (status === 0) {
        return (
            <VStack h="100vh" justifyContent="center" spacing="4">
                <Text>開始をお待ちください...</Text>
                <Spinner size="xl" />
            </VStack>
        )
    }

    if (status === 2) {
        return (
            <main>
                <VStack h="100vh" justifyContent="center" spacing="4">
                    <Text>回答結果は...</Text>

                    <Text>{`${result.total}問中 ${result.currect}問正解でした！`}</Text>
                </VStack>
            </main>
        )
    }

    return (
        <main>
            {isAnswered ? (
                <VStack h="100vh" justifyContent="center" spacing="4">
                    {questionId === 8 && isAnswered ? (
                        <Text>集計中です...</Text>
                    ) : (
                        <Text>次の質問までお待ちください...</Text>
                    )}
                    <Spinner size="xl" />
                </VStack>
            ) : (
                <VStack h="100vh" justifyContent="center" spacing="12">
                    <Text fontWeight="bold" fontSize="4xl">
                        {questionId}問目
                    </Text>

                    <Flex
                        flexWrap="wrap"
                        w="800px"
                        justifyContent="center"
                        gap="12px"
                    >
                        {ANSWER_VALUES.map((value) => (
                            <Button
                                key={value}
                                type="button"
                                w="300px"
                                h="60px"
                                isLoading={false}
                                border={
                                    selectedValue === value
                                        ? "1px solid #666"
                                        : undefined
                                }
                                onClick={(e) => {
                                    e.preventDefault()
                                    onClickValue(value)
                                }}
                            >
                                {toStr(value)}
                            </Button>
                        ))}
                    </Flex>

                    <div>
                        <Button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault()
                                onClickSubmit()
                            }}
                        >
                            送信
                        </Button>
                    </div>
                </VStack>
            )}
        </main>
    )
}
