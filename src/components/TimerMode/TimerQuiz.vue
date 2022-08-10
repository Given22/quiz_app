<script lang="ts">
import { useStore } from "vuex";
import { defineComponent } from "vue";
import { decode } from "html-entities";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Icon } from "@iconify/vue";

import TimerFooter from "@/components/TimerMode/TimerFooter.vue";

import "swiper/css";

import type { Quiz, Answers } from "@/types/types";

export default defineComponent({
  data: () => ({
    answers: {} as Answers,
    timer_start: 0,
    activeQuestion_time: 0,
    activeQuestion_start_time: 0,
    timer_id: 0 as any,
    time: "00:00:00",
    activeSlide: 0,
    TIMERMODE_QUESTION_LENGTH: 30000,
  }),
  methods: {
    // decode html entities
    decode(str: string) {
      return decode(str);
    },
    // start quiz and timer
    start() {
      this.startTimer();
      this.timer_start = new Date().getTime();

      setInterval(() => {
        let time = new Date().getTime() - this.timer_start;
        this.time = this.convertMsToTime(time);
        this.$store.commit("setTime", { time: this.time });
      }, 1000);
    },
    // set answers to store
    setAnswers() {
      this.$store.commit("setAnswers", { answers: this.answers });
    },
    // finish quiz and redirect to results
    finish() {
      this.setAnswers();
      clearInterval(this.timer_id);
      this.$router.push("/answers");
    },
    // convert milliseconds to good looking time format
    convertMsToTime(milliseconds: number) {
      let seconds = Math.floor(milliseconds / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);

      return `${this.padTo2Digits(hours % 24)}:${this.padTo2Digits(
        minutes % 60
      )}:${this.padTo2Digits(seconds % 60)}`;
    },
    padTo2Digits(num: number) {
      return num.toString().padStart(2, "0");
    },

    // Swiper navigation methods

    // next slide
    next() {
      // @ts-ignore
      const swiper = document.querySelector(".swiper")?.swiper;
      if(swiper) swiper.slideNext();
    },

    startTimer() {
      this.activeQuestion_start_time = new Date().getTime();

      clearInterval(this.timer_id);
      if (this.activeSlide === this.quiz.length - 1) return;
      this.timer_id = setInterval(() => {
        this.activeQuestion_time =
          new Date().getTime() - this.activeQuestion_start_time;

        if (this.activeQuestion_time > this.TIMERMODE_QUESTION_LENGTH)
          this.next();
      }, 100);
    },

    // update active slide index
    updateSlideIndex() {
      this.$store.commit("setQuestionTime", {
        questionNumber: this.activeSlide,
        time: this.activeQuestion_time,
      });

      this.startTimer();
      // @ts-ignore
      const swiper = document.querySelector(".swiper")?.swiper;
      this.activeSlide = swiper.activeIndex;
      if(this.activeSlide === this.quiz.length) this.finish();
    },
  },
  components: {
    Icon,
    Swiper,
    SwiperSlide,
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

    return {
      quiz,
      store,
    };
  },
});
</script>

<template>
  <Swiper
    class="swiper"
    ref="swiperRef"
    :centeredSlides="true"
    :slidesPerView="1"
    :spaceBetween="60"
    :threshold="30"
    :allowSlidePrev="false"
    @slideChange="updateSlideIndex"
  >
    <swiper-slide v-for="(item, index) in quiz">
      <div class="quiz-head">
        <p class="quiz-question">{{ decode(item?.question) }}</p>
        <div class="quiz-info">
          <p>{{ decode(item.category) }}</p>
          <p>, {{ decode(item.difficulty) }}</p>
        </div>
      </div>
      <div class="quiz-answers" v-bind:class="item.type">
        <div v-for="ask in item?.answers" class="quiz-answer">
          <input
            type="radio"
            v-on:change="setAnswers"
            v-bind:id="ask + index"
            v-bind:value="ask"
            v-bind:name="item.question"
            v-model="answers[item.question]"
          />
          <label
            class="quiz-answer-label"
            :class="{ false: ask === 'False', true: ask === 'True' }"
            v-bind:for="ask + index"
            v-bind:name="item?.question"
            >{{ decode(ask) }}</label
          >
        </div>
      </div>
    </swiper-slide>
    <swiper-slide>
      <div class="final-slide">
        <button class="quiz_button" @click="finish">Finish</button>
      </div>
    </swiper-slide>
  </Swiper>
  <div class="swiper-buttons">
    <div
      class="swiper-button swiper-button-next"
      :class="{ hide: activeSlide >= quiz.length }"
      @click="next()"
    >
      next
    </div>
  </div>
  <Icon
    class="swipe-icon swipe-icon-left"
    :class="{ hide: activeSlide === quiz.length }"
    icon="ic:outline-swipe-left"
    color="var(--color-green-light)"
    height="50"
  />
  <TimerFooter
    :time="time"
    :answers="Object.keys(answers).length"
    :quiz_lenght="TIMERMODE_QUESTION_LENGTH"
    :question_time.sync="activeQuestion_time"
    :questions="quiz.length"
  />
</template>

<style lang="scss">
// Swiper

.swiper {
  width: 80%;
  min-height: 60%;
  // margin: 7rem 0;
  display: flex;

  align-items: center;
  justify-content: center;
}

.swiper-wrapper {
  align-items: center;
  height: 100%;
}

.swiper-slide {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  &:active {
    cursor: grabbing;
  }
}

// Swipe icons

.swipe-icon {
  position: fixed;
  bottom: 3.5rem;
  opacity: 0.4;
  z-index: 5;
  height: 5vh;
}

.swipe-icon-center,
.swipe-icon-left {
  transition: all 0.3s ease-in-out;
  transform-origin: bottom;
  &:hover,
  &:active {
    animation: right 1.5s ease-in-out;
  }
}

.swipe-icon-right {
  transition: all 0.3s ease-in-out;
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

.swiper-buttons {
  position: fixed;
  width: 80%;
  display: flex;
  justify-content: space-between;
  bottom: 3rem;
  padding: 0.5rem 1.5rem;
  z-index: 3;
}

.swiper-button {
  color: var(--color-green-light);
  cursor: pointer;
  &:hover {
    transform: scale(0.95);
  }
  &:active {
    transform: scale(0.95);
  }
}

.swiper-button-next {
  margin-left: auto;
}

.swiper-button-prev {
  margin-right: auto;
}

// One question

.quiz_button {
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
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: translateY(5px);
    box-shadow: 0px 0px 0px rgba(233, 196, 106, 0.25),
      0px 0px 0px rgba(0, 0, 0, 0.25);
    color: var(--color-green-light);
  }
}

.quiz-question {
  font-size: 1.5rem;
  color: #fff;
  text-align: center;
  letter-spacing: 0.08em;
}

.quiz-answers {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2vh;
  flex-direction: column;
  align-items: center;
}

.quiz-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  &:active {
    cursor: grabbing;
  }
  .quiz-info {
    opacity: 0.5;
    color: var(--color-green-light);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    line-height: 1rem;
  }
}

.quiz-answer {
  border: 0px solid;
  border-radius: 10px;
  font-size: 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .quiz-answer-label {
    display: block;
    width: 90%;
    cursor: pointer;
    border-radius: 10px;
    padding: 0.5rem 1rem;
    transition: all 0.3s ease-in-out;
    background-color: var(--color-green-light);
    letter-spacing: 0.1em;
    color: var(--color-green-dark);
    &.false {
      background-color: var(--color-orange);
      color: var(--color-green-dark);
      text-align: center;
    }
    &.true {
      text-align: center;
      background-color: var(--color-green-light);
      color: var(--color-green-dark);
    }
  }
}

input[type="radio"]:checked + .quiz-answer-label {
  color: #fff;
  opacity: 1;
}

input[type="radio"]:not(:checked) + .quiz-answer-label {
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
}

input[type="radio"] {
  display: none;
}

// Slide with finish button

.final-slide {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

// responsive design

@media screen and (min-width: 1024px) {
  .quiz-question {
    font-size: 1.1rem;
  }

  .timer_mode {
    height: 2rem;
    width: 70%;
  }
  .quiz-answer {
    font-size: 1.2rem;
    width: 100%;
    .quiz-answer-label {
      width: 60%;
      padding: 0.4rem 1rem;
      letter-spacing: 0.1em;
    }
  }
  .swiper-buttons {
    width: 80%;
  }
  .swiper-button {
    font-size: 1.7rem;
  }
  .quiz_button {
    height: 3rem;
    font-size: 1.5rem;
    width: 30%;
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  .quiz-question {
    font-size: 1.1rem;
  }
  .quiz-answer {
    font-size: 1rem;
    width: 100%;
    .quiz-answer-label {
      width: 80%;
      padding: 0.2rem 0.5rem;
      letter-spacing: 0.1em;
    }
  }
  .timer_mode {
    height: 2rem;
    width: 30%;
  }
  .swiper-buttons {
    width: 90%;
  }
  .swiper-button {
    font-size: 1.5rem;
  }
  .quiz_button {
    height: 3rem;
    font-size: 1.5rem;
    width: 40%;
    &.timer_mode {
      height: 2rem;
      width: 25%;
    }
  }
}

@media screen and (max-width: 767px) {
  .quiz-question {
    font-size: 1rem;
  }
  .quiz-answer {
    font-size: 1rem;
    width: 100%;
    .quiz-answer-label {
      width: 100%;
      padding: 0.5rem 1rem;
      letter-spacing: 0.1em;
    }
  }
  .swiper-buttons {
    width: 100%;
  }
  .swiper-button {
    font-size: 1.3rem;
  }

  .quiz_button {
    height: 3rem;
    font-size: 1.5rem;
    width: 40%;
  }
}

.hide {
  display: none;
}
</style>
