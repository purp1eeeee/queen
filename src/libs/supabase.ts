import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getAllAnswerRanking = async () => {
  console.log(supabase.from('?'))
}

type AnswerValue = 1 | 2 | 3 | 4

export const postAnswer = async (
  questionId: string,
  emailAddress: string,
  answerValue: AnswerValue
) => {
  const insertValue = {
    question_id: questionId,
    email_address: emailAddress,
    answer_value: answerValue,
  }

  try {
    await supabase.from("answers").insert(insertValue)
  } catch (error) {
    throw error
  }
}
