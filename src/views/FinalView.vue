<!-- Final Page with answer and player stats -->

<script lang="ts">
import { useStore } from "vuex";
import { defineComponent } from "vue";
import { decode } from "html-entities";
import { saveState, getState } from "@/stores/localStorage";

import NavBar from "@/components/NavBar.vue";
import AnswersSection from "@/components/Final/AnswersSection.vue";
import StatsSection from "@/components/Final/StatsSection.vue";

import LoadingScreen from "@/components/LoadingScreen.vue";

import { convert_ms_to_time } from "@/utils/functions";

import type {
  Quiz,
  Answers,
  Statistic,
  Categories,
  Type,
  Difficulty,
} from "@/types/types";

export default defineComponent({
  data: () => ({
    correctAnswers: 0,
    show: false,
    activeCard: {} as Quiz,
    activeAnswer: "",
    percents: 0,
    endMsg: "",
    trophyColor: "",
    isLoading: true,
    stats: [] as Statistic[],
  }),
  components: {
    NavBar,
    StatsSection,
    AnswersSection,
    LoadingScreen,
  },
  methods: {
    // decode html entities
    decode(str: string) {
      return decode(str);
    },

    convert_ms_to_time(number: number) {
      return convert_ms_to_time(number);
    },

    // check if answer is correct
    check_answer(question: string) {
      const que = this.quiz.find((q) => q.question === question);
      if (!this.answers[question]) return;
      if (que && que.correct_answer === this.answers[question]) return true;
      return false;
    },

    // check all questions and calculate percentage of correct answers
    check_answers() {
      this.quiz.forEach((question: Quiz) => {
        if (this.check_answer(question.question)) {
          this.correctAnswers++;
        }
      });

      // calculate percentage of correct answers
      return (this.percents = Math.floor(
        (this.correctAnswers / this.quiz.length) * 100
      ));
    },

    // show card with question and answers
    show_card(id: number) {
      this.quiz[id].playerAnswer = this.answers[this.quiz[id].question];

      this.show = true;
      this.activeCard = this.quiz[id];
    },

    // hide card with question and answers
    hide_card() {
      this.show = false;
    },

    sum(name: string) {
      const quiz = this.$store.getters.quiz;
      let sum = 0;
      quiz.results.forEach((q: Quiz) => {
        q.category === name ? (sum += 1) : 0;
      });
      return sum;
    },

    //Conver data to statistics
    create_new_statistic() {
      const store = useStore();
      const stats = store.getters.stats;
      const quiz = store.getters.quiz;

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

      quiz.results.forEach((q: Quiz) => {
        difficulty[q.difficulty as keyof Difficulty] += 1;
        category[q.category as keyof Categories] += 1;
        type[q.type as keyof Type] += 1;
      });

      if (stats.mode === "timer") {
        let avg_time = 0;

        quiz.results.forEach((q: Quiz) => {
          avg_time += q.playerTime ? q.playerTime : 0;
        });

        avg_time = Math.round(avg_time / quiz.results.length);

        return {
          mode: stats.mode,
          date: new Date(),
          percents: this.check_answers(),
          questions_number: stats.questionNumber,
          category: category,
          difficulty: difficulty,
          type: type,
          avg_time: avg_time,
          timer_timeout: stats.timer_timeout,
        };
      }
      return {
        mode: stats.mode,
        date: new Date(),
        percents: this.check_answers(),
        questions_number: stats.questionNumber,
        category: category,
        difficulty: difficulty,
        type: type,
        time: store.getters.time,
      };
    },
  },
  mounted() {
    const newStatistic: Statistic = this.create_new_statistic();
    if (!newStatistic.mode) return;
    const storage = getState("previous");
    if (storage) {
      const previous = JSON.parse(storage);
      this.stats = [newStatistic, ...previous];
    } else {
      this.stats = [newStatistic];
    }

    saveState("previous", JSON.stringify(this.stats));
    this.isLoading = false;
  },
  setup() {
    // get data from Vuex store
    const store = useStore();
    const quiz: Quiz[] = store.getters.quiz.results;

    // IF quiz is empty, go to home page
    if (quiz.length === 0) window.location.href = "/";

    const answers: Answers = store.getters.answers;
    const time: string = store.getters.time;

    return {
      quiz,
      answers,
      time,
    };
  },
});
</script>

<template>
  <div v-if="isLoading">
    <LoadingScreen />
  </div>
  <div v-if="!isLoading" class="FinalView">
    <NavBar />
    <AnswersSection />
    <StatsSection :stats="stats" />
  </div>
</template>

<style lang="scss">
.FinalView {
  display: flex;
  flex-direction: column;
  margin-top: 4rem;
  align-items: center;
  width: 100%;
  gap: 3rem;
}

// responsive design

@media screen and (min-width: 1024px) {
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
}

@media screen and (max-width: 767px) {
}
</style>
