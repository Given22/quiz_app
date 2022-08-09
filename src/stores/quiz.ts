import { createStore } from "vuex";
import arrayShuffle from "array-shuffle";

interface Quiz {
  answers?: string[];
  category: string;
  correct_answer: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

interface Answer {
  [key: string]: string;
}

// Create a new store instance.
export const store = createStore({
  state: {
    quiz: { results: [] as Quiz[] },
    playerAnswers: [] as Answer[],
    time: "",
  },
  mutations: {
    setQuiz(state, prop) {
      prop.data.results.map((quiz: Quiz) => {
        quiz.answers = arrayShuffle(
          quiz?.incorrect_answers.concat(quiz.correct_answer)
        );
      });
      state.quiz = prop.data;
    },

    setAnswers(state, prop) {
      state.playerAnswers = prop.answers;
    },

    setTime(state, prop) {
      state.time = prop.time;
    },

    removeQuiz() {
      localStorage.removeItem("quiz");
    },
  },
  getters: {
    quiz: (state) => state.quiz,
    answers: (state) => state.playerAnswers,
    time: (state) => state.time,
  },
});
