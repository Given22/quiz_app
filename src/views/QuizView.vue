<script lang="ts">
import { useStore } from "vuex";
import { defineComponent } from "vue";

import QuizSection from "@/components/QuizSection.vue";

import "swiper/css";

import type { Quiz } from "@/types/types";

export default defineComponent({
  data: () => ({
    started: false,
    timerInfo: false,
    TIMERMODE_QUESTION_LENGTH: 10000,
  }),
  methods: {
    // start quiz and set mode
    start_normal_mode() {
      this.$store.commit("setQuizMode", { mode: "normal" });
      this.started = true;
    },
    start_timer_mode() {
      this.$store.commit("setQuizMode", { mode: "timer" });
      this.started = true;
    },
  },
  components: {
    QuizSection,
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
      <div class="Quiz">
        <div class="StartPage" v-if="!started">
          <button class="QuizButton" @click="start_normal_mode">
            Normal Mode
          </button>
          <button class="QuizButton TimerMode" @click="start_timer_mode()">
            Timer mode
          </button>
          <p class="SettingButton" @click="timerInfo = !timerInfo">
            Timer mode settings
          </p>
          <div class="TimerInfo" v-if="timerInfo">
            <input
              type="radio"
              id="5"
              value="5000"
              v-model="TIMERMODE_QUESTION_LENGTH"
            />
            <label class="TimerSetlabel" for="5">5s</label>
            <input
              type="radio"
              id="10"
              value="10000"
              v-model="TIMERMODE_QUESTION_LENGTH"
            />
            <label class="TimerSetlabel" for="10">10s</label>
            <input
              type="radio"
              id="20"
              value="20000"
              v-model="TIMERMODE_QUESTION_LENGTH"
            />
            <label class="TimerSetlabel" for="20">20s</label>
            <input
              type="radio"
              id="30"
              value="30000"
              v-model="TIMERMODE_QUESTION_LENGTH"
            />
            <label class="TimerSetlabel" for="30">30s</label>
          </div>
        </div>
        <QuizSection
          v-if="started"
          :TIMERMODE_QUESTION_LENGTH="TIMERMODE_QUESTION_LENGTH"
        />
      </div>
    </template>
  </Suspense>
</template>

<style lang="scss" scoped>
.Quiz {
  display: flex;
  width: 100vw;
  height: 100vh;

  align-items: center;
  justify-content: center;
}

.SettingButton {
  font-size: 1rem;
  color: var(--color-green-light);
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(0.9);
  }
}

.TimerInfo {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  .TimerSetlabel {
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
  }
}

// start page

.StartPage {
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

input[type="radio"]:checked + .TimerSetlabel {
  opacity: 1;
  &:hover {
    color: var(--color-green-light);
  }
}

input[type="radio"]:not(:checked) + .TimerSetlabel {
  opacity: 0.5;
  transform: translateY(5px);
  box-shadow: 0px 0px 0px rgba(233, 196, 106, 0.25),
    0px 0px 0px rgba(0, 0, 0, 0.25);
  &:hover {
    opacity: 1;
  }
}

input[type="radio"] {
  display: none;
}

@media screen and (min-width: 1024px) {
  .TimerInfo {
    width: 40%;
    .TimerSetlabel {
      min-width: 15%;
    }
  }
  .QuizButton {
    height: 3rem;
    font-size: 1.5rem;
    width: 30%;
    &.TimerMode {
      min-height: 2rem;
      width: 20%;
    }
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  .TimerInfo {
    width: 40%;
    .TimerSetlabel {
      min-width: 40%;
    }
  }
  .QuizButton {
    height: 3rem;
    font-size: 1.5rem;
    width: 40%;
    &.TimerMode {
      min-height: 2rem;
      width: 25%;
    }
  }
}

@media screen and (max-width: 767px) {
  .TimerInfo {
    width: 70%;
    .TimerSetlabel {
      min-width: 45%;
    }
  }
  .QuizButton {
    height: 3rem;
    font-size: 1.5rem;
    min-width: 70%;
    &.TimerMode {
      min-height: 2rem;
    }
  }
}
</style>
