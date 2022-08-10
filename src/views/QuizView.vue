<script lang="ts">
import { useStore } from "vuex";
import { defineComponent } from "vue";

import NormalQuiz from "@/components/NormalMode/NormalQuiz.vue";
import TimerQuiz from "@/components/TimerMode/TimerQuiz.vue";

import "swiper/css";

import type { Quiz } from "@/types/types";

export default defineComponent({
  data: () => ({
    started: false,
    timer_mode: false,
    timer_info: false,
    normal_mode: false,
    TIMERMODE_QUESTION_LENGTH: 15000,
  }),
  methods: {
    // start quiz and timer
    startNormalMode() {
      this.normal_mode = true;
      this.started = true;
    },
    startTimerMode() {
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
          <button class="quiz_button" @click="startNormalMode">
            Normal Mode
          </button>
          <button class="quiz_button timer_mode" @click="startTimerMode()">
            Timer mode
          </button>
          <p class="setting_button" @click="timer_info = !timer_info">
            Timer mode settings
          </p>
          <div class="timer_info" v-if="timer_info">
            <button
              class="timer_button"
              @click="(TIMERMODE_QUESTION_LENGTH = 5000), startTimerMode()"
            >
              5s
            </button>
            <button
              class="timer_button"
              @click="(TIMERMODE_QUESTION_LENGTH = 10000), startTimerMode()"
            >
              10s
            </button>
            <button
              class="timer_button"
              @click="(TIMERMODE_QUESTION_LENGTH = 20000), startTimerMode()"
            >
              20s
            </button>
            <button
              class="timer_button"
              @click="(TIMERMODE_QUESTION_LENGTH = 30000), startTimerMode()"
            >
              30s
            </button>
          </div>
        </div>
        <NormalQuiz v-if="normal_mode" />
        <TimerQuiz
          v-if="timer_mode"
          :TIMERMODE_QUESTION_LENGTH="TIMERMODE_QUESTION_LENGTH"
        />
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

.setting_button{
  font-size: 1rem;
  color: var(--color-green-light);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover{
    transform: scale(0.9);
  }
}

.timer_info {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  .timer_button {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 1.7rem;
    border: 0px solid;
    color: var(--color-green-dark);
    background-color: var(--color-yellow);
    font-size: 1rem;
    font-family: "Righteous";
    border-radius: 10px;
    padding: 0.5rem 2rem;
    box-shadow: 0px 5px 0px rgba(233, 196, 106, 0.3),
      3px 10px 5px rgba(0, 0, 0, 0.25);
    transition: all 0.3s ease-in-out;
    &:hover {
      transform: translateY(5px);
      box-shadow: 0px 0px 0px rgba(233, 196, 106, 0.25),
        0px 0px 0px rgba(0, 0, 0, 0.25);
      color: var(--color-green-light);
    }
  }
}

// start page

.start_page {
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
  .timer_info{
    width: 40%;
    .timer_button{
      min-width: 15%;
    }
  }
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
  .timer_info{
    width: 40%;
    .timer_button{
      min-width: 40%;
    }
  }
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
  .timer_info{
    width: 70%;
    .timer_button{
      min-width: 45%;
    }
  }
  .quiz_button {
    height: 3rem;
    font-size: 1.5rem;
    min-width: 70%;
    &.timer_mode {
      min-height: 2rem;
    }
  }
}
</style>
