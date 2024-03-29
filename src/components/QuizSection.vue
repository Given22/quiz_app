<script lang="ts">
import { useStore } from "vuex";
import { defineComponent } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Icon } from "@iconify/vue";

import TimerFooter from "@/components/Footers/TimerFooter.vue";
import NormalFooter from "@/components/Footers/NormalFooter.vue";

import { decode_text, convert_ms_to_time } from "@/utils/functions";

import "swiper/css";

import type { Quiz, Answers } from "@/types/types";

export default defineComponent({
  data: () => ({
    answers: {} as Answers,
    timerStart: 0,
    timer: setInterval(() => {
      console.log("timer work");
    }, 1000),
    time: "00:00:00",
    swiperOptions: {
      spaceBetween: 50,
      centeredSlides: true,
      slidesPerView: 1,
      touchRatio: 0.2,
    },
    activeSlide: 0,
    activeQuestionTime: 0,
    activeQuestionStartTime: 0,
  }),
  props: {
    TIMERMODE_QUESTION_LENGTH: Number,
  },
  methods: {
    decode: decode_text,
    // start quiz and timer
    start() {
      this.start_timer();
      this.timerStart = new Date().getTime();

      setInterval(() => {
        const time = new Date().getTime() - this.timerStart;
        this.time = convert_ms_to_time(time);
        this.$store.commit("setTime", { time: this.time });
      }, 1000);
    },
    // set answers to store
    set_answers() {
      this.$store.commit("setAnswers", { answers: this.answers });
    },
    // finish quiz and redirect to results
    finish() {
      this.set_answers();
      clearInterval(this.timer);
      this.$router.push("/answers");
    },
    start_timer() {
      this.activeQuestionStartTime = new Date().getTime();

      clearInterval(this.timer);
      if (this.activeSlide === this.quiz.length - 1) return;
      this.timer = setInterval(() => {
        this.activeQuestionTime =
          new Date().getTime() - this.activeQuestionStartTime;
        if (this.mode === "timer" && this.TIMERMODE_QUESTION_LENGTH) {
          if (this.activeQuestionTime >= this.TIMERMODE_QUESTION_LENGTH)
            this.next();
        }
      }, 100);
    },
    // // Swiper navigation methods
    // // previous slide
    prev() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const swiper = (document.querySelector(".swiper") as any).swiper;
      if (swiper) swiper.slidePrev();
    },

    // next slide
    next() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const swiper = (document.querySelector(".swiper") as any).swiper;
      if (swiper) swiper.slideNext();
    },

    // update active slide index
    update_slide_index() {
      this.$store.commit("setQuestionTime", {
        questionNumber: this.activeSlide,
        time: this.activeQuestionTime,
      });

      this.start_timer();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const swiper = (document.querySelector(".swiper") as any).swiper;
      if (swiper) this.activeSlide = swiper.activeIndex;
      if (this.mode === "timer" && this.activeSlide === this.quiz.length)
        this.finish();
    },
  },
  components: {
    Icon,
    Swiper: Swiper,
    SwiperSlide,
    NormalFooter,
    TimerFooter,
  },
  beforeMount() {
    this.start();
  },
  setup() {
    // get data form store
    const store = useStore();
    const quiz: Quiz[] = store.getters.quiz.results;

    if (quiz.length === 0) window.location.href = "/";

    const mode = store.getters.mode;
    const allowSlidePrev = mode == "timer" ? false : true;

    return {
      quiz,
      mode,
      allowSlidePrev,
    };
  },
});
</script>

<template>
  <Swiper
    class="Swiper"
    :centeredSlides="true"
    :slidesPerView="1"
    :spaceBetween="60"
    :threshold="30"
    :allowSlidePrev="allowSlidePrev"
    @slideChange="update_slide_index"
  >
    <swiper-slide
      v-for="(item, index) in quiz"
      v-bind:key="index"
      class="SwiperSlide"
    >
      <div class="QuizHead">
        <p class="QuizQuestion">{{ decode(item?.question) }}</p>
        <div class="QuizInfo">
          <p>{{ decode(item.category) }}</p>
          <p>, {{ decode(item.difficulty) }}</p>
        </div>
      </div>
      <div class="QuizAnswers" v-bind:class="item.type">
        <div v-for="ask in item?.answers" class="QuizAnswer" v-bind:key="ask">
          <input
            type="radio"
            v-on:change="set_answers"
            v-bind:id="ask + index"
            v-bind:value="ask"
            v-bind:name="item.question"
            v-model="answers[item.question]"
          />
          <label
            class="QuizAnswerLabel"
            :class="{ False: ask === 'False', True: ask === 'True' }"
            v-bind:for="ask + index"
            v-bind:name="item?.question"
            >{{ decode(ask) }}</label
          >
        </div>
      </div>
    </swiper-slide>
    <swiper-slide class="SwiperSlide">
      <div class="FinalSlide" v-if="mode === 'normal'">
        <button class="QuizButton" @click="finish">Finish</button>
      </div>
    </swiper-slide>
  </Swiper>
  <div class="SwiperButtons">
    <div
      class="SwiperButton SwiperButtonPrev"
      :class="{ Hide: activeSlide === 0 }"
      @click="prev()"
      v-if="mode === 'normal'"
    >
      prev
    </div>
    <div
      class="SwiperButton SwiperButtonNext"
      :class="{ Hide: activeSlide >= quiz.length }"
      @click="next()"
    >
      next
    </div>
  </div>
  <Icon
    class="SwipeIcon SwipeIconCenter"
    :class="{ Hide: activeSlide === 0 || activeSlide === quiz.length }"
    icon="ic:outline-swipe"
    color="var(--color-green-light)"
    height="50"
    v-if="mode === 'normal'"
  />
  <Icon
    class="SwipeIcon SwipeIconLeft"
    :class="{ Hide: activeSlide !== 0 }"
    icon="ic:outline-swipe-left"
    color="var(--color-green-light)"
    height="50"
    v-if="mode === 'normal'"
  />
  <Icon
    class="SwipeIcon SwipeIconLeft"
    :class="{ Hide: activeSlide === quiz.length }"
    icon="ic:outline-swipe-left"
    color="var(--color-green-light)"
    height="50"
    v-if="mode === 'timer'"
  />
  <Icon
    class="SwipeIcon SwipeIconRight"
    :class="{ Hide: activeSlide !== quiz.length }"
    icon="ic:outline-swipe-right"
    color="var(--color-green-light)"
    height="50"
  />
  <TimerFooter
    v-if="mode === 'timer'"
    :time="time"
    :answers="Object.keys(answers).length"
    :quiz_lenght="TIMERMODE_QUESTION_LENGTH"
    v-model:question_time="activeQuestionTime"
    :questions="quiz.length"
  />
  <NormalFooter
    v-if="mode === 'normal'"
    :time="time"
    :answers="Object.keys(answers).length"
    :questions="quiz.length"
  />
</template>

<style lang="scss">
// Swiper

.Swiper {
  width: 80%;
  min-height: 60%;
  // margin: 7rem 0;
  display: flex;

  align-items: center;
  justify-content: center;
}

.SwiperWrapper {
  align-items: center;
  height: 100%;
}

.SwiperSlide {
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  &:active {
    cursor: grabbing;
  }
}

// Swipe icons

.SwipeIcon {
  position: fixed;
  bottom: 3.5rem;
  opacity: 0.4;
  z-index: 5;
  height: 5vh;
}

.SwipeIconCenter,
.SwipeIconLeft {
  transition: animation 0.3s ease-in-out;
  transform-origin: bottom;
  &:hover,
  &:active {
    animation: right 1.5s ease-in-out;
  }
}

.SwipeIconRight {
  transition: animation 0.3s ease-in-out;
  transform-origin: bottom;
  &:hover,
  &:active {
    animation: left 1.5s ease-in-out;
  }
}

// swipe icons animation

@keyframes left {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-30deg);
  }
  75% {
    transform: rotate(30deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes right {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(30deg);
  }
  75% {
    transform: rotate(-30deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

// Swiper custom buttons

.SwiperButtons {
  position: fixed;
  width: 80%;
  display: flex;
  justify-content: space-between;
  bottom: 3rem;
  padding: 0.5rem 1.5rem;
  z-index: 3;
}

.SwiperButton {
  color: var(--color-green-light);
  cursor: pointer;
  &:hover {
    transform: scale(0.95);
  }
  &:active {
    transform: scale(0.95);
  }
}

.SwiperButtonNext {
  margin-left: auto;
}

.SwiperButtonPrev {
  margin-right: auto;
}

// One question

.QuizButton {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 3.5rem;
  border: 0px solid;
  color: var(--color-green-dark);
  background-color: var(--color-yellow);
  font-size: 2rem;
  font-family: "Righteous";
  border-radius: 10px;
  padding: 0.5rem 2rem;
  box-shadow: 0px 5px 0px rgba(233, 196, 106, 0.3),
    3px 10px 5px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s ease-in-out, color 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
  &:hover {
    transform: translateY(5px);
    box-shadow: 0px 0px 0px rgba(233, 196, 106, 0.25),
      0px 0px 0px rgba(0, 0, 0, 0.25);
    color: var(--color-green-light);
  }
}

.QuizQuestion {
  font-size: 1.5rem;
  color: #fff;
  text-align: center;
  letter-spacing: 0.08em;
}

.QuizAnswers {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2vh;
  flex-direction: column;
  align-items: center;
}

.QuizHead {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  &:active {
    cursor: grabbing;
  }
  .QuizInfo {
    opacity: 0.5;
    color: var(--color-green-light);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    line-height: 1rem;
  }
}

.QuizAnswer {
  border: 0px solid;
  border-radius: 10px;
  font-size: 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .QuizAnswerLabel {
    display: block;
    width: 90%;
    cursor: pointer;
    border-radius: 10px;
    padding: 0.5rem 1rem;
    background-color: var(--color-green-light);
    letter-spacing: 0.1em;
    color: var(--color-green-dark);
    &.False {
      background-color: var(--color-orange);
      color: var(--color-green-dark);
      text-align: center;
    }
    &.True {
      background-color: var(--color-green-light);
      color: var(--color-green-dark);
      text-align: center;
    }
  }
}

input[type="radio"]:checked + .QuizAnswerLabel {
  color: #fff;
  opacity: 1;
}

input[type="radio"]:not(:checked) + .QuizAnswerLabel {
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
}

input[type="radio"] {
  display: none;
}

// Slide with finish button

.FinalSlide {
  // height: 100%;
  // min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

// responsive design

@media screen and (min-width: 1024px) {
  .QuizQuestion {
    font-size: 1.1rem;
  }

  .TimerMode {
    height: 2rem;
    width: 70%;
  }
  .QuizAnswer {
    font-size: 1.2rem;
    width: 100%;
    .QuizAnswerLabel {
      width: 60%;
      padding: 0.4rem 1rem;
      letter-spacing: 0.1em;
    }
  }
  .SwiperButtons {
    width: 80%;
  }
  .SwiperButton {
    font-size: 1.7rem;
  }
  .QuizButton {
    height: 3rem;
    font-size: 1.5rem;
    width: 30%;
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  .QuizQuestion {
    font-size: 1.1rem;
  }
  .QuizAnswer {
    font-size: 1rem;
    width: 100%;
    .QuizAnswerLabel {
      width: 80%;
      padding: 0.55rem 0.5rem;
      letter-spacing: 0.1em;
    }
  }
  .TimerMode {
    height: 2rem;
    width: 30%;
  }
  .SwiperButtons {
    width: 90%;
  }
  .SwiperButton {
    font-size: 1.5rem;
  }
  .QuizButton {
    height: 3rem;
    font-size: 1.5rem;
    width: 40%;
    &.TimerMode {
      height: 2rem;
      width: 25%;
    }
  }
}

@media screen and (max-width: 767px) {
  .QuizQuestion {
    font-size: 1rem;
  }
  .QuizAnswer {
    font-size: 1rem;
    width: 100%;
    .QuizAnswerLabel {
      width: 100%;
      padding: 0.5rem 1rem;
      letter-spacing: 0.1em;
    }
  }
  .SwiperButtons {
    width: 100%;
  }
  .SwiperButton {
    font-size: 1.3rem;
  }

  .QuizButton {
    height: 3rem;
    font-size: 1.5rem;
    width: 40%;
  }
}

.Hide {
  display: none;
}
</style>
