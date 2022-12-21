export interface Quiz {
  answers: string[];
  category: string;
  difficulty: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  question: string;
  type: string;
  playerAnswer?: string;
  playerTime?: string;
}

export interface Answers {
  [key: string]: string;
}

export interface Times {
  [key: string]: string;
}