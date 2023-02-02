<!-- Statictics Page with answer and player stats -->

<script lang="ts">
import { defineComponent } from "vue";
import { decode } from "html-entities";
import { getState } from "@/stores/localStorage";

import NavBar from "@/components/NavBar.vue";
import StatsSection from "@/components/Final/StatsSection.vue";

import LoadingScreen from "@/components/LoadingScreen.vue";

import { convert_ms_to_time } from "@/utils/functions";

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
    // decode html entities
    decode(str: string) {
      return decode(str);
    },

    convert_ms_to_time(number: number) {
      return convert_ms_to_time(number);
    },
  },
  async mounted() {
    const storage = getState("previous");
    if (storage) {
      const previous = await JSON.parse(storage);
      this.stats = await [...previous];
      this.isLoading = await false;
    } else {
      window.location.href = "/";
    }
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
