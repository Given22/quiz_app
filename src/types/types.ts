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
  category: Categories;
  difficulty: Difficulty;
  type: Type;
  avg_time?: string;
  timer_timeout?: number;
  time?: string;
}

export interface Categories {
  "General Knowledge": number;
  "Entertainment: Books": number;
  "Entertainment: Film": number;
  "Entertainment: Music": number;
  "Entertainment: Musicals & Theatres": number;
  "Entertainment: Television": number;
  "Entertainment: Video Games": number;
  "Entertainment: Board Games": number;
  "Science & Nature": number;
  "Science: Computers": number;
  "Science: Mathematics": number;
  Mythology: number;
  Sports: number;
  Geography: number;
  History: number;
  Politics: number;
  Art: number;
  Celebrities: number;
  Animals: number;
  Vehicles: number;
  "Entertainment: Comics": number;
  "Science: Gadgets": number;
  "Entertainment: Japanese Anime & Manga": number;
  "Entertainment: Cartoon & Animations": number;
}
export interface Difficulty {
  easy: number;
  medium: number;
  hard: number;
}

export interface Type {
  multiple: number;
  boolean: number;
}

export interface NormalModesStats {
  percentage: number[];
  questions: number[];
  difficulty: Difficulty;
}

export interface TimerModeStats {
  percentage: number[];
  avg_times: string[];
  timeouts: {
    '5s': number;
    '10s': number;
    '20s': number;
    '30s': number;
  };
  difficulty: Difficulty;
}

export interface AllModesStats {
  percentages: {
    name: string;
    data: number[]
  }[];
  categories: Categories;
  types: Type;
  difficulties: Difficulty;
  modes: {
    normal: number;
    timer: number;
  }
}