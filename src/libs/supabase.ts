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
  answerValue: AnswerValue
) => {
  console.log(supabase)
}
