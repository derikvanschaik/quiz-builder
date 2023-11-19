// define types here to be used in other components

export type AnswerType = 'basic' | 'multiple'

export interface MultipleAnswerType {
  answer: string
  isAnswer: boolean
}

export interface Quiz {
  question: string
  answer: string
  answers: MultipleAnswerType[]
  answerType: AnswerType
}
