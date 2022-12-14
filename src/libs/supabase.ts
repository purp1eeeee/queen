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
