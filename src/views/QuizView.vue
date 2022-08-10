<script lang="ts">
import { useStore } from "vuex";
import { defineComponent } from "vue";

import NormalQuiz from '@/components/NormalMode/NormalQuiz.vue';
import TimerQuiz from '@/components/TimerMode/TimerQuiz.vue';

import "swiper/css";

import type { Quiz } from "@/types/types";

export default defineComponent({
  data: () => ({
    started: false,
    timer_mode: false,
    normal_mode: false,
  }),
  methods: {
    // start quiz and timer
    startNormalMode() {
      this.normal_mode = true; 
      this.started = true; 
    },
    startTimerMode(){
      this.timer_mode = true;
      this.started = true;
    },
  },
  components: {
    NormalQuiz,
    TimerQuiz,
  },
  setup() {
    // get data form store
    const store = useStore();
    const quiz: Quiz[] = store.getters.quiz.results;

    if (quiz.length === 0) window.location.href = "/";

    return {
      quiz,
    };
  },
});
</script>

<template>
  <Suspense>
    <template #default>
      <div class="quiz">
        <div class="start_page" v-if="!started">
          <button class="quiz_button"  @click="startNormalMode">
            Normal Mode
          </button>
          <button class="quiz_button timer_mode" @click="startTimerMode">
            Timer mode
          </button>
        </div>
        <NormalQuiz v-if="normal_mode" />
        <TimerQuiz v-if="timer_mode" />
      </div>
    </template>
  </Suspense>
</template>

<style lang="scss" scoped>
.quiz {
  display: flex;
  width: 100vw;
  height: 100vh;

  align-items: center;
  justify-content: center;
}

// start page

.start_page{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@media screen and (min-width: 1024px) {

  .quiz_button {
    height: 3rem;
    font-size: 1.5rem;
    width: 30%;
    &.timer_mode {
      min-height: 2rem;
      width: 20%;
    }
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  .quiz_button {
    height: 3rem;
    font-size: 1.5rem;
    width: 40%;
    &.timer_mode {
      min-height: 2rem;
      width: 25%;
    }
  }
}

@media screen and (max-width: 767px) {
  .quiz_button {
    height: 3rem;
    font-size: 1.5rem;
    min-width: 50%;
    &.timer_mode {
      min-height: 2rem;
    }
  }
}
</style>
