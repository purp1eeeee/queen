import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getAllAnswerRanking = async () => {
  console.log(supabase.from('?'))
}

type AnswerValue = 1 | 2 | 3 | 4

export const postAnswer = async (
  questionId: string,
  answerValue: AnswerValue,
  adress: string
) => {
  const insertValue = {
    question_id: questionId,
    adress: adress,
    answer: answerValue,
    created_at: new Date()
  }

  let { error } = await supabase.from("answers").insert(insertValue)
  if (error) {
    throw error
  }
}
