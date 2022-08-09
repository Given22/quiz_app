export interface Quiz {
  answers: string[];
  category: string;
  difficulty: string;
  correct_answer: string;
  incorrect_answers: string[];
  question: string;
  type: string;
  playerAnswer?: string;
}

export interface Answers {
  [key: string]: string;
}