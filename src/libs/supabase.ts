import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

type Answer = {
    email_address: string
    question_id: number
    answer_value: number
}

export const getAllAnswerRanking = async () => {
    const { data: _answers } = await supabase
        .from("answers")
        .select("email_address, question_id, answer_value")
    const { data: questions } = await supabase
        .from("questions")
        .select("id, correct")

    const answers = _answers as Answer[]

    const result = answers.reduce<Record<string, number>>((p, c) => {
        const currect = questions?.find((v) => v.id === c.question_id)
            ?.correct as number
        if (!currect) {
            return p
        }

        const isCurrent = c.answer_value === currect

        const value = p[c.email_address] ?? 0

        return {
            ...p,
            [c.email_address]: isCurrent ? value + 1 : value,
        }
    }, {})

    const _want = Object.entries(result)
    _want.sort((a, b) => b[1] - a[1])

    const want = Object.fromEntries(_want)
    console.log(want)
    return want
}

export const getResultByEmail = async (email: string) => {
    const { data: _answers } = await supabase
        .from("answers")
        .select("email_address, question_id, answer_value")
        .eq("email_address", email)
    const answers = _answers as Answer[]

    const { data: questions } = await supabase
        .from("questions")
        .select("id, correct")

    const currect = answers.reduce((p, c) => {
        const q = questions?.find((v) => v.id === c.question_id)
        if (!q) {
            return p
        }

        if (q.correct === c.answer_value) {
            return p + 1
        }
        return p
    }, 0)

    return {
        total: answers.length,
        currect,
    }
}

type AnswerValue = 1 | 2 | 3 | 4

type AnswerRequest = {
    questionId: number
    emailAddress: string
    answerValue: AnswerValue
}
export const postAnswer = async (req: AnswerRequest) => {
    const { count } = await supabase
        .from("answers")
        .select("*", { count: "exact" })
        .eq("question_id", req.questionId)
        .eq("email_address", req.emailAddress)

    if (count !== 0) {
        console.log("depulicate!!!!!")
        return
    }

    await supabase.from("answers").insert({
        question_id: req.questionId,
        email_address: req.emailAddress,
        answer_value: req.answerValue,
    })
}

export const getQuestionPosition = async () => {
    const { data, error } = await supabase
        .from("current_question_positions")
        .select("current_question_id")
        .eq("id", 1)
    return { data, error }
}

export const getCurrentQuestionId = async (): Promise<number> => {
    const { data } = await supabase
        .from("current_question_positions")
        .select("current_question_id")
        .limit(1)
    if (!data) {
        throw new Error("")
    }
    return data[0]?.current_question_id
}

export const updateQuestionPosition = async (newQuestionId: number) => {
    await supabase.from("current_question_positions").update({
        id: 1,
        current_question_id: newQuestionId,
    })
}

export const getQuestionPositionChannel = () => {
    const positionChannel = supabase.channel("current_question_positions")
    return positionChannel
}

export const getGameStatusChannel = () => {
    return supabase.channel("game_status")
}

export const checkIsAnsweredByEmailAndQuestionId = async (
    email: string,
    questionId: number
): Promise<boolean> => {
    const { count } = await supabase
        .from("answers")
        .select("*", { count: "exact" })
        .eq("email_address", email)
        .eq("question_id", questionId)

    if (count === 0) {
        return false
    }
    return true
}

export const getSession = async () => {
    return await supabase.auth.getSession()
}

export const getGameStatus = async () => {
    const { data } = await supabase.from("game_status").select("*").limit(1)
    if (!data) {
        throw new Error("")
    }
    return data[0]
}

export const postGameStatus = async (status: 0 | 1 | 2) => {
    await supabase.from("game_status").update({
        id: 1,
        status,
    })
}
