import { createStore } from "vuex";
import arrayShuffle from "array-shuffle";

import type { Quiz, Answers } from "@/types/types";

// Create a new store instance.
export const store = createStore({
  state: {
    quiz: { results: [] as Quiz[] },
    playerAnswers: [] as Answers[],
    time: "",
  },
  mutations: {
    //Set the state of quiz
    setQuiz(state, prop) {
      prop.data.results.map((quiz: Quiz) => {
        quiz.answers = arrayShuffle(
          quiz?.incorrect_answers.concat(quiz.correct_answer)
        );
      });
      state.quiz = prop.data;
    },

    // Set the state of player answers
    setAnswers(state, prop) {
      state.playerAnswers = prop.answers;
    },

    // Set the state of time
    setTime(state, prop) {
      state.time = prop.time;
    },
    
    // Set the time of questions
    setQuestionTime(state, prop) {
      if(!state.quiz.results[prop.questionNumber]) return;
      if(state.quiz.results[prop.questionNumber]?.playerTime){
        state.quiz.results[prop.questionNumber].playerTime += prop.time;
      } else {
        state.quiz.results[prop.questionNumber].playerTime = prop.time;
      }
    }
  },
  getters: {
    quiz: (state) => state.quiz,
    answers: (state) => state.playerAnswers,
    time: (state) => state.time,
  },
});
