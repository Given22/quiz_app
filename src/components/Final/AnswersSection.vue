<!-- Final Page with answer and player stats -->

<script lang="ts">
import { useStore } from "vuex";
import { defineComponent } from "vue";
import { decode_text } from "@/utils/functions";
import { Icon } from "@iconify/vue";
import Card from "@/components/Cards/CardComp.vue";

import type { Quiz, Answers } from "@/types/types";

import { check_answers, check_answer } from "@/utils/answers";

export default defineComponent({
  data: () => ({
    correctAnswers: 0,
    show: false,
    activeCard: {} as Quiz,
    activeAnswer: "",
    percents: 0,
    endMsg: "",
    trophyColor: "",
  }),
  components: {
    Card,
    Icon,
  },
  methods: {
    decode: decode_text,
    check_answer,

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
  },
  beforeMount() {
    // check answers before component is mounted
    const { correctAnswers, percents } = check_answers(this.quiz, this.answers);

    // set trophy Color and message
    if (percents >= 80) {
      this.trophyColor = "var(--color-yellow)";
      this.endMsg = "You are a true Quiz Master!";
    } else if (percents >= 60) {
      this.trophyColor = "var(--color-silver)";
      this.endMsg = "That was close to be a Quiz Master!";
    } else {
      this.trophyColor = "var(--color-green-light)";
      this.endMsg = "Next time will be better!";
    }

    this.correctAnswers = correctAnswers;
    this.percents = percents;
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
  <div class="Answers">
    <div class="AnswersHead">
      <Icon icon="fluent:trophy-48-filled" height="100" class="Trophy" />
      <p>{{ endMsg }}</p>
      <br />
      <p>Your score is: {{ percents }}%</p>
      <p>Your time: {{ time }}</p>
    </div>
    <section class="AnswersQuestions">
      <div
        v-for="Q in quiz"
        :key="Q.question"
        class="AnswersCard"
        v-bind:class="{
          Correct: check_answer(Q.question, quiz, answers),
          Incorrect: !check_answer(Q.question, quiz, answers),
        }"
      >
        <p>#{{ quiz.indexOf(Q) + 1 }}</p>
        <div
          @click="show_card(quiz.indexOf(Q))"
          v-bind:class="{
            AnswersCardCorrect: check_answer(Q.question, quiz, answers),
            AnswersCardIncorrect: !check_answer(Q.question, quiz, answers),
          }"
        >
          <Icon
            v-if="check_answer(Q.question, quiz, answers)"
            icon="bi:check"
            color="white"
            height="150"
            class="AnswerIcon"
          />
          <Icon
            v-if="!check_answer(Q.question, quiz, answers)"
            icon="bi:x"
            color="black"
            height="150"
            class="AnswerIcon"
          />
        </div>
      </div>
    </section>
    <div class="sign">
      <h3>Statistics</h3>
      <Icon icon="fa6-solid:arrow-down-long" height="150" class="StatsIcon" />
    </div>
    <Card v-if="show" :question="activeCard" @click="hide_card" />
  </div>
</template>

<style lang="scss">
.Answers {
  min-height: 83vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.AnswersQuestions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.AnswersHead {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.2rem;
  svg path {
    color: v-bind(trophyColor);
  }
}

.AnswersCard {
  display: flex;
  font-size: 1.2rem;
  gap: 0.3rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &.Correct {
    color: rgb(207, 207, 207);
  }

  &.Incorrect {
    color: var(--color-green-darker);
  }

  .AnswersCardIncorrect {
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
  .AnswersCardCorrect {
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

  .AnswersCardIncorrect,
  .AnswersCardCorrect {
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    border-radius: 10px;
    &:hover {
      cursor: pointer;
    }
  }
}

.sign {
  position: absolute;
  bottom: -10%;
  > h3 {
    text-align: center;
  }
}

.AnswerIcon {
  height: 2rem;
  width: 6rem;
}

// responsive design

@media screen and (min-width: 1024px) {
  .Answers {
    width: 70%;
  }
  .AnswerIcon {
    width: 5vw;
  }
  .AnswersQuestions {
    max-width: 90%;
  }
  .AnswersHead {
    font-size: 1.2rem;
    svg {
      height: 5rem;
    }
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  .Answers {
    width: 100%;
  }
  .AnswerIcon {
    width: 9vw;
  }
  .AnswersQuestions {
    max-width: 60%;
  }
  .AnswersHead {
    font-size: 1.2rem;
    svg {
      height: 5rem;
    }
  }
}

@media screen and (max-width: 767px) {
  .Answers {
    width: 100%;
    padding-top: 4rem;
  }
  .AnswerIcon {
    width: 17vw;
  }
  .AnswersQuestions {
    max-width: 90%;
  }
  .AnswersHead {
    font-size: 1.2rem;
    svg {
      height: 5rem;
    }
  }
}
</style>
