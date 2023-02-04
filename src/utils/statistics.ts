import type {
  Statistic,
  NormalModeStats,
  TimerModeStats,
  AllModesStats,
  Categories,
  Type,
  Difficulty,
  DisplayableStatistic,
  Quiz,
  Answers,
} from "@/types/types";

import { useStore } from "vuex";

import { convert_ms_to_sec } from "./functions";
import { check_answers } from "./answers";

export const emptyDisplayStatistics = {
  allStats: {
    percentages: [
      {
        name: "Normal mode",
        data: [],
      },
      {
        name: "Timer mode",
        data: [],
      },
    ],
    categories: {
      "General Knowledge": 0,
      "Entertainment: Books": 0,
      "Entertainment: Film": 0,
      "Entertainment: Music": 0,
      "Entertainment: Musicals & Theatres": 0,
      "Entertainment: Television": 0,
      "Entertainment: Video Games": 0,
      "Entertainment: Board Games": 0,
      "Science & Nature": 0,
      "Science: Computers": 0,
      "Science: Mathematics": 0,
      Mythology: 0,
      Sports: 0,
      Geography: 0,
      History: 0,
      Politics: 0,
      Art: 0,
      Celebrities: 0,
      Animals: 0,
      Vehicles: 0,
      "Entertainment: Comics": 0,
      "Science: Gadgets": 0,
      "Entertainment: Japanese Anime & Manga": 0,
      "Entertainment: Cartoon & Animations": 0,
    } as Categories,
    types: {
      multiple: 0,
      boolean: 0,
    } as Type,
    difficulties: {
      easy: 0,
      medium: 0,
      hard: 0,
    } as Difficulty,
    modes: {
      normal: 0,
      timer: 0,
    },
  } as AllModesStats,
  timerStats: {
    percentage: [],
    avg_times: [],
    timeouts: {
      "5s": 0,
      "10s": 0,
      "20s": 0,
      "30s": 0,
    },
    difficulty: {
      easy: 0,
      medium: 0,
      hard: 0,
    },
  } as TimerModeStats,
  normalStats: {
    percentage: [],
    questions: [],
    difficulty: {
      easy: 0,
      medium: 0,
      hard: 0,
    },
  } as NormalModeStats,
} as DisplayableStatistic;

export const create_display_stats = (data: Statistic[]) => {
  const stats = emptyDisplayStatistics;

  data.forEach((q: Statistic) => {
    if (q.mode)
      stats.allStats.modes[q.mode as keyof AllModesStats["modes"]] += 1;
    if (q.difficulty) {
      for (const dif in q.difficulty) {
        stats.allStats.difficulties[dif as keyof Difficulty] +=
          q.difficulty[dif as keyof Difficulty];
        if (q.mode === "normal")
          stats.normalStats.difficulty[dif as keyof Difficulty] +=
            q.difficulty[dif as keyof Difficulty];
        if (q.mode === "timer")
          stats.timerStats.difficulty[dif as keyof Difficulty] +=
            q.difficulty[dif as keyof Difficulty];
      }
    }
    if (q.type) {
      for (const typ in q.type) {
        stats.allStats.types[typ as keyof Type] += q.type[typ as keyof Type];
      }
    }
    if (q.category) {
      for (const category in q.category) {
        stats.allStats.categories[category as keyof Categories] +=
          q.category[category as keyof Categories];
      }
    }
    if (q.percents !== undefined) {
      if (q.mode === "normal") {
        stats.allStats.percentages[0].data = [
          q.percents,
          ...stats.allStats.percentages[0].data,
        ];
        stats.normalStats.percentage = [
          q.percents,
          ...stats.normalStats.percentage,
        ];
      }
      if (q.mode === "timer") {
        stats.allStats.percentages[1].data = [
          q.percents,
          ...stats.allStats.percentages[1].data,
        ];
        stats.timerStats.percentage = [
          q.percents,
          ...stats.timerStats.percentage,
        ];
      }
    }
    if (q.questions_number && q.mode === "normal") {
      stats.normalStats.questions = [
        q.questions_number,
        ...stats.normalStats.questions,
      ];
    }
    if (q.avg_time && q.mode === "timer") {
      stats.timerStats.avg_times = [q.avg_time, ...stats.timerStats.avg_times];
    }
    if (q.timer_timeout && q.mode === "timer") {
      stats.timerStats.timeouts[
        `${Number(q.timer_timeout) / 1000}s` as keyof TimerModeStats["timeouts"]
      ] += 1;
    }
  });
  return stats;
};

export function isDisStat(obj: unknown): obj is DisplayableStatistic {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "allStats" in obj &&
    "timerStats" in obj &&
    "normalStats" in obj
  );
}
export function isStatistic(obj: unknown): obj is Statistic {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "mode" in obj &&
    "date" in obj &&
    "percents" in obj &&
    "questions_number" in obj &&
    "category" in obj &&
    "type" in obj &&
    "difficulty" in obj
  );
}

export function isArrayOfStatistics(obj: unknown): obj is Statistic[] {
  let isArrayOfStatistics = true;
  if (Array.isArray(obj) && obj !== null) {
    obj.forEach((statistic) => {
      if (!isStatistic(statistic)) isArrayOfStatistics = false;
    });
  }
  return typeof obj === "object" && obj !== null && isArrayOfStatistics;
}

export const create_new_statistic = (answers: Answers, time: string) => {
  const store = useStore();
  const stats = store.getters.stats;
  const quiz = store.getters.quiz.results;

  const category: Categories = {
    "General Knowledge": 0,
    "Entertainment: Books": 0,
    "Entertainment: Film": 0,
    "Entertainment: Music": 0,
    "Entertainment: Musicals & Theatres": 0,
    "Entertainment: Television": 0,
    "Entertainment: Video Games": 0,
    "Entertainment: Board Games": 0,
    "Science & Nature": 0,
    "Science: Computers": 0,
    "Science: Mathematics": 0,
    Mythology: 0,
    Sports: 0,
    Geography: 0,
    History: 0,
    Politics: 0,
    Art: 0,
    Celebrities: 0,
    Animals: 0,
    Vehicles: 0,
    "Entertainment: Comics": 0,
    "Science: Gadgets": 0,
    "Entertainment: Japanese Anime & Manga": 0,
    "Entertainment: Cartoon & Animations": 0,
  };

  const difficulty = {
    easy: 0,
    medium: 0,
    hard: 0,
  };

  const type = {
    multiple: 0,
    boolean: 0,
  };

  quiz.forEach((q: Quiz) => {
    difficulty[q.difficulty as keyof Difficulty] += 1;
    category[q.category as keyof Categories] += 1;
    type[q.type as keyof Type] += 1;
  });

  const { percentages } = check_answers(quiz, answers);

  let avg_time = 0;
  if (stats.mode === "timer") {
    quiz.forEach((q: Quiz) => {
      avg_time += q.playerTime ? q.playerTime : 0;
    });
  }

  return {
    type: type,
    time: time,
    mode: stats.mode,
    date: new Date(),
    category: category,
    percents: percentages,
    difficulty: difficulty,
    timer_timeout: stats.timer_timeout,
    questions_number: stats.questionNumber,
    avg_time: convert_ms_to_sec(Math.round(avg_time / quiz.length)),
  } as Statistic;
};
