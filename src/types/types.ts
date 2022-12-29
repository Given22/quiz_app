export interface Quiz {
  answers: string[];
  category: string;
  difficulty: string;
  correct_answer: string;
  incorrect_answers: string[];
  question: string;
  type: string;
  playerAnswer?: string;
  playerTime?: number;
}

export interface Answers {
  [key: string]: string;
}

export interface Statistic {
  mode: "normal" | "timer";
  date: Date;
  percents: number;
  questions_number: number;
  category: string;
  difficulty: string;
  type: string;
  avg_time?: number;
  timer_timeout?: number;
  time?: string;
}
