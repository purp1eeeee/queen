import {
    Box,
    Button,
    Center,
    Flex,
    HStack,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react"
import Head from "next/head"
import Image from "next/image"
import { useState, useEffect } from "react"
import {
    postAnswer,
    updateQuestionPosition,
    getQuestionPositionChannel,
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
    const current_question_number = 1

    const [selectedValue, setSelectedValue] = useState<
        ANSWER_VALUES | undefined
    >(undefined)

    const [questionId, setCurrentQuestionId] = useState<number>(1)

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
                }
            )
            .subscribe()
        return () => {
            positionListener.unsubscribe()
        }
    }, [])

    const onClickPosition = () => {
        updateQuestionPosition(questionId + 1)
    }

    const onClickValue = (value: ANSWER_VALUES) => {
        setSelectedValue(value)
    }

    const onClickSubmit = async () => {
        if (!selectedValue) {
            return
        }
        postAnswer({
            questionId: questionId,
            emailAddress: "hoge@hoge",
            answerValue: selectedValue,
        })
    }

    return (
        <main>
            <Head>
                <title>queen</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

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
                <div>
                    <Button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault()
                            onClickPosition()
                        }}
                    >
                        次へ
                    </Button>
                </div>
            </VStack>
        </main>
    )
}
