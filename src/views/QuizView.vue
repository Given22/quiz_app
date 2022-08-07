<script lang="ts">
import { defineComponent } from "vue";
import { decode } from "html-entities";
import { Swiper, SwiperSlide, useSwiper } from "swiper/vue";

import FooterQuiz from "@/components/FooterQuiz.vue";

import "swiper/css";

import "swiper/css/pagination";

interface Quiz {
  answers: string[];
  category: string;
  correct_answer: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

interface Answers {
  [key: string]: string;
}

const swiper = useSwiper();

console.log(swiper);

export default defineComponent({
  data: () => ({
    quiz: [] as Quiz[],
    started: false,
    answers: {} as Answers,
    timer_start: 0,
    time: "00:00:00",
    swiperOptions: {
      spaceBetween: 50,
      centeredSlides: true,
      slidesPerView: 1,
      touchRatio: 0.2,
    },
    activeSlide: 0,
  }),
  methods: {
    start() {
      const data = JSON.parse(localStorage.getItem("quiz") as string);
      this.timer_start = new Date().getTime();

      setInterval(() => {
        let time = new Date().getTime() - this.timer_start;
        this.time = this.convertMsToTime(time);
        localStorage.setItem("time", time.toString());
      }, 1000);

      if (data.results.length > 0) {
        this.quiz = data.results;
        this.started = true;
      }
    },
    save() {
      console.log(this.answers);
      localStorage.setItem("answers", JSON.stringify(this.answers));
    },
    decode(str: string) {
      return decode(str);
    },
    finish() {
      window.location.href = "/answers";
    },
    convertMsToTime(milliseconds: number) {
      let seconds = Math.floor(milliseconds / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);

      seconds = seconds % 60;
      minutes = minutes % 60;

      hours = hours % 24;

      return `${this.padTo2Digits(hours)}:${this.padTo2Digits(
        minutes
      )}:${this.padTo2Digits(seconds)}`;
    },
    padTo2Digits(num: number) {
      return num.toString().padStart(2, "0");
    },
    prev() {
      // @ts-ignore
      const swiper = document.querySelector(".swiper")?.swiper;
      swiper.slidePrev();
    },
    next() {
      // @ts-ignore
      const swiper = document.querySelector(".swiper")?.swiper;
      swiper.slideNext();
    },
    updateSlideIndex() {
      // @ts-ignore
      const swiper = document.querySelector(".swiper")?.swiper;
      this.activeSlide = swiper.activeIndex;
    },
  },
  components: {
    Swiper,
    SwiperSlide,
    FooterQuiz,
  },
  mounted() {},
  setup() {
    const data = JSON.parse(localStorage.getItem("quiz") as string);
    if (!data) window.location.href = "/";
  },
});
</script>

<template>
  <div class="quiz">
    <button class="quiz_button" v-if="!started" @click="start">Start</button>
    <Swiper
      class="swiper"
      ref="swiperRef"
      :centeredSlides="true"
      :slidesPerView="1"
      :spaceBetween="60"
      v-if="started"
      @slideChange="updateSlideIndex"
    >
      <swiper-slide v-for="(item, index) in quiz">
        <p class="quiz-question">{{ decode(item?.question) }}</p>
        <div class="quiz-answers" v-bind:class="item.type">
          <div v-for="ask in item?.answers" class="quiz-answer">
            <input
              type="radio"
              v-on:change="save"
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
        <button class="quiz_button finish" @click="finish">Finish</button>
      </swiper-slide>
    </Swiper>
    <div v-if="started" class="swiper-buttons">
      <div
        class="swiper-button swiper-button-prev"
        :class="{ hide: activeSlide === 0 }"
        @click="prev()"
      >
        prev
      </div>
      <div
        class="swiper-button swiper-button-next"
        :class="{ hide: activeSlide >= quiz.length }"
        @click="next()"
      >
        next
      </div>
    </div>
    <FooterQuiz
      :time="time"
      :answers="Object.keys(answers).length"
      :questions="quiz.length"
    />
  </div>
</template>

<style lang="scss" scoped>
.quiz {
  display: flex;
  width: 100vw;
  height: 100vh;

  align-items: center;
  justify-content: center;
}
.quiz_button {
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
  }
}

.hide {
  display: none;
}

.swiper {
  width: 80%;
  height: 60%;
}

.swiper-buttons {
  position: fixed;
  width: 100%;
  display: flex;
  justify-content: space-between;
  bottom: 3rem;
  padding: 0.5rem 1.5rem;
  z-index: 3;
}

.swiper-slide {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.swiper-button {
  color: var(--color-green-light);
  font-size: 2rem;
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
}

input[type="radio"] {
  display: none;
}

@media screen and (min-width: 1024px) {
  .quiz-answer {
    font-size: 1.5rem;
    width: 100%;
    .quiz-answer-label {
      width: 60%;
      padding: 0.5rem 1rem;
      letter-spacing: 0.1em;
    }
  }
  .finish {
    width: 50%;
    margin: 0 auto;
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  .quiz-question {
    font-size: 1.3rem;
  }
  .quiz-answer {
    font-size: 1.3rem;
    width: 100%;
    .quiz-answer-label {
      width: 80%;
      padding: 0.5rem 1rem;
      letter-spacing: 0.1em;
    }
  }
  .finish {
    width: 70%;
    margin: 0 auto;
  }
}

@media screen and (max-width: 767px) {
  .quiz-answer {
    font-size: 1.3rem;
    width: 100%;
    .quiz-answer-label {
      width: 100%;
      padding: 0.5rem 1rem;
      letter-spacing: 0.1em;
    }
  }
  .finish {
    width: 90%;
    margin: 0 auto;
  }
}
</style>
