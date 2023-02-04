<!-- Final Page with answer and player stats -->

<script lang="ts">
import { useStore } from "vuex";
import { defineComponent } from "vue";
import { saveState, getState } from "@/stores/localStorage";

import NavBar from "@/components/NavBar.vue";
import AnswersSection from "@/components/Final/AnswersSection.vue";
import StatsSection from "@/components/StatsSection.vue";

import LoadingScreen from "@/components/LoadingScreen.vue";

import { decode_text, convert_ms_to_sec } from "@/utils/functions";

import { create_new_statistic } from "@/utils/statistics";

import type { Quiz, Answers, Statistic } from "@/types/types";

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
    decode: decode_text,
    convert_ms_to_sec,

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
  },
  mounted() {
    const newStatistic: Statistic = create_new_statistic(
      this.answers,
      this.time
    );

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
  justify-content: center;
  width: 100%;
  gap: 3rem;
}

// responsive design

@media screen and (min-width: 1024px) {
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
}

@media screen and (max-width: 767px) {
  .FinalView {
    gap: 5rem;
  }
}
</style>
