import { defineStore } from "pinia";

export const useQuiz = defineStore({
  id: "quiz",
  state: () => ({
    quiz: { results: [] },
  }),
  getters: {
    getQuiz: (state) => state.quiz,
  },
  actions: {
    async setQuiz() {
      const data = await fetch(
        "https://opentdb.com/api.php?amount=10&category=19&type=multiple"
      );
      const quiz = await data.json();
      this.quiz = quiz;
      console.log(this.quiz.results);
    },
  },
});
