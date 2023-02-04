<!-- Statictics Page with answer and player stats -->

<script lang="ts">
import { defineComponent } from "vue";
import { getState } from "@/stores/localStorage";

import NavBar from "@/components/NavBar.vue";
import StatsSection from "@/components/StatsSection.vue";

import LoadingScreen from "@/components/LoadingScreen.vue";

import { convert_ms_to_time, decode_text } from "@/utils/functions";
import { isArrayOfStatistics } from "@/utils/statistics";
import type { Quiz, Statistic } from "@/types/types";

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
    LoadingScreen,
  },
  methods: {
    decode: decode_text,
    convert_ms_to_time,
  },
  async mounted() {
    new Promise((resolve, reject) => {
      const storage = getState("previous");
      if (storage) {
        resolve(JSON.parse(storage));
      } else {
        reject(new Error("No data at localstorage"));
      }
    })
      .then((value) => {
        if (isArrayOfStatistics(value)) {
          this.stats = [...value];
        }
      })
      .then(() => {
        this.isLoading = false;
      })
      .catch(() => {
        window.location.href = "/home";
      });
  },
});
</script>

<template>
  <div v-if="isLoading">
    <LoadingScreen />
  </div>
  <div v-if="!isLoading" class="StaticticsView">
    <NavBar />
    <StatsSection :stats="stats" />
  </div>
</template>

<style lang="scss">
.StaticticsView {
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
