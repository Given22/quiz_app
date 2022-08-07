<script lang="ts">
import { defineComponent } from "vue";
import { decode } from "html-entities";
import { Icon } from "@iconify/vue";
import Card from "@/components/Card.vue";

interface Quiz {
  answers?: string[];
  playerAnswer?: string;
  category: string;
  correct_answer: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

interface Quizes {
  response_code: string;
  results: Quiz[];
}

export default defineComponent({
  data: () => ({
    quiz: JSON.parse(localStorage.getItem("quiz") as string) as Quizes,
    answers: JSON.parse(localStorage.getItem("answers") as string) as {
      [key: string]: string;
    },
    time: JSON.parse(localStorage.getItem("time") as string) as number,
    correct_answers: 0,
    show: false,
    activeCard: {} as Quiz,
    activeAnswer: "",
  }),
  components: {
    Card,
    Icon,
  },
  methods: {
    decode(str: string) {
      return decode(str);
    },
    check_answer(question: string) {
      const que = this.quiz.results.find((q) => q.question === question);
      if (que) {
        if (que.correct_answer === this.answers[question]) {
          return true;
        }
      }
      return false;
    },
    check_answers() {
      this.quiz.results.forEach((question: Quiz) => {
        if (this.check_answer(question.question)) {
          this.correct_answers++;
        }
      });
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
    showCard(id: number) {
      this.quiz.results[id].playerAnswer = this.answers[this.quiz.results[id].question];

      this.show = true;
      this.activeCard = this.quiz.results[id];
    },
    hideCard() {
      this.show = false;
    },
  },
  beforeMount() {
    if (!this.quiz) window.location.href = "/";
    if (!this.answers) window.location.href = "/";
    this.check_answers();
    localStorage.removeItem("answers");
    localStorage.removeItem("time");
    localStorage.removeItem("quiz");
  },
});
</script>

<template>
  <div class="answers">
    <p>Your score is: {{ correct_answers }} / {{ quiz.results.length }}</p>
    <p>Your time: {{ convertMsToTime(time) }}</p>
    <section class="answers__questions">
      <div
        v-for="question in quiz.results"
        :key="question.question"
        class="answers__card"
        v-bind:class="{
          correct: check_answer(question.question),
          incorrect: !check_answer(question.question),
        }"
      >
        <p>#{{ quiz.results.indexOf(question) + 1 }}</p>
        <div
          @click="showCard(quiz.results.indexOf(question))"
          v-bind:class="{
            answers__card__correct: check_answer(question.question),
            answers__card__incorrect: !check_answer(question.question),
          }"
        >
          <Icon
            v-if="check_answer(question.question)"
            icon="bi:check"
            color="white"
            height="100"
            class="answer-icon"
          />
          <Icon
            v-if="!check_answer(question.question)"
            icon="bi:x"
            color="black"
            height="100"
            class="answer-icon"
          />
        </div>
      </div>
    </section>
    <Card v-if="show" :question="activeCard" @click="hideCard" />
  </div>
</template>

<style lang="scss">
.answers {
  min-height: 50vh;
  color: rgb(207, 207, 207);
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  position: absolute;
  top: 20vh;
}

.answers__questions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 10vh;
}

.answers__card {
  display: flex;
  gap: 1rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &.correct {
    color: rgb(207, 207, 207);
  }

  &.incorrect {
    color: var(--color-green-darker);
  }

  .answers__card__incorrect {
    background-color: var(--color-orange);
    box-shadow: 0px 5px 0px rgba(233, 196, 106, 0.25),
      4px 10px 3px rgba(0, 0, 0, 0.25);
    &:active,
    &:hover {
      box-shadow: 0px 0px 0px rgba(233, 196, 106, 0.25),
        0px 0px 0px rgba(0, 0, 0, 0.25);
      transform: translateY(5px);
    }
  }
  .answers__card__correct {
    background-color: var(--color-green-light);
    box-shadow: 0px 5px 0px rgba(83, 182, 132, 0.25),
      4px 10px 3px rgba(0, 0, 0, 0.25);
    &:active,
    &:hover {
      box-shadow: 0px 0px 0px rgba(83, 182, 132, 0.25),
        0px 0px 0px rgba(0, 0, 0, 0.25);
      transform: translateY(5px);
    }
  }

  .answers__card__incorrect,
  .answers__card__correct {
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease-in-out;
    border-radius: 10px;
    &:hover {
      cursor: pointer;
    }
  }
}

.answer-icon {
  height: 4rem;
  width: 6rem;
}

@media screen and (min-width: 1024px) {
  .answers {
    width: 100%;
    margin: 0 auto;
  }
  .answer-icon {
    height: 5vh;
    width: 5vw;
  }
  .answers__questions {
    max-width: 90%;
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  .answers {
    width: 100%;
    margin: 0 auto;
  }
  .answer-icon {
    height: 2.5rem;
    width: 15vw;
  }
  .answers__questions {
    max-width: 80%;
  }
}

@media screen and (max-width: 767px) {
  .answers {
    width: 100%;
    margin: 0 auto;
  }
  .answer-icon {
    height: 2rem;
    width: 17vw;
  }
  .answers__questions {
    max-width: 90%;
  }
}
</style>
