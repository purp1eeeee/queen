import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getAllAnswerRanking = async () => {
    console.log(supabase.from("?"))
}

type AnswerValue = 1 | 2 | 3 | 4

type AnswerRequest = {
    questionId: number
    emailAddress: string
    answerValue: AnswerValue
}
export const postAnswer = async (req: AnswerRequest) => {
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
    console.log("data: ", data)
    return { data, error }
}

export const updateQuestionPosition = async (newQuestionId: number) => {
    await supabase.from("current_question_positions").upsert({
        id: 1,
        current_question_id: newQuestionId,
    })
}

export const getQuestionPositionChannel = () => {
    const positionChannel = supabase.channel("current_question_positions")
    return positionChannel
}

export const getMe = async () => {
    return await supabase.auth.getUser()
}
