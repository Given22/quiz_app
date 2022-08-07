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

// Create a new store instance.
export const store = createStore({
  state: {
    quiz: { results: [] as Quiz[] }
  },
  mutations: {
    async setQuiz(state, prop) {
      state.quiz = prop.data;
      console.log(state.quiz);
    },
    saveQuiz(state){
      state.quiz.results.map(result =>{
        result.answers = arrayShuffle(result?.incorrect_answers.concat(result.correct_answer));
      })
      localStorage.setItem('quiz', JSON.stringify(state.quiz));
    },
    removeQuiz(){
      localStorage.removeItem('quiz');
    }
  },
  getters: { quiz: (state) => state.quiz },
});
