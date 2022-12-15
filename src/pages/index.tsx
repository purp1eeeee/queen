import Head from "next/head"
import Image from "next/image"
import { useState, useEffect } from "react"
import {
    postAnswer,
    updateQuestionPosition,
    getQuestionPositionChannel,
} from "../libs/supabase"
import styles from "../styles/Home.module.css"

const ANSWER_VALUES = [1, 2, 3, 4] as const
type ANSWER_VALUES = typeof ANSWER_VALUES[number]

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
        <div className={styles.container}>
            <Head>
                <title>queen</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>{questionId}問目</h1>

                <div className={styles.grid}>
                    {ANSWER_VALUES.map((value) => (
                        <button
                            key={value}
                            type="button"
                            className={`${styles.card} ${
                                selectedValue === value ? styles.selected : ""
                            }`}
                            onClick={(e) => {
                                e.preventDefault()
                                onClickValue(value)
                            }}
                        >
                            {value}
                        </button>
                    ))}
                </div>

                <div>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault()
                            onClickSubmit()
                        }}
                    >
                        送信
                    </button>
                </div>
                <div>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault()
                            onClickPosition()
                        }}
                    >
                        次へ
                    </button>
                </div>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{" "}
                    <span className={styles.logo}>
                        <Image
                            src="/vercel.svg"
                            alt="Vercel Logo"
                            width={72}
                            height={16}
                        />
                    </span>
                </a>
            </footer>
        </div>
    )
}
