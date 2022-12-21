<!-- Final Page with answer and player stats -->

<script lang="ts">
import { useStore } from "vuex";
import { defineComponent } from "vue";
import { decode } from "html-entities";
import { Icon } from "@iconify/vue";
import Card from "@/components/CardComp.vue";

import type { Quiz, Answers } from "@/types/types";

export default defineComponent({
  data: () => ({
    correct_answers: 0,
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
    // decode html entities
    decode(str: string) {
      return decode(str);
    },
    
    
    
    // check if answer is correct
    check_answer(question: string) {
      const que = this.quiz.find((q) => q.question === question);
      if(!this.answers[question]) return;
      if (que && que.correct_answer === this.answers[question]) return true; 
      return false;
    },
    
    // check all questions and calculate percentage of correct answers
    check_answers() {
      this.quiz.forEach((question: Quiz) => {
        if (this.check_answer(question.question)) {
          this.correct_answers++;
        }
      });
      
      // calculate percentage of correct answers
      this.percents = Math.floor(
        (this.correct_answers / this.quiz.length) * 100
      );
      
      // set trophy Color and message
      if (this.percents >= 80) {
        this.trophyColor = "var(--color-yellow)";
        this.endMsg = "You are a true Quiz Master!";
      } else if (this.percents >= 60) {
        this.trophyColor = "var(--color-silver)";
        this.endMsg = "That was close to be a Quiz Master!";
      } else {
        this.trophyColor = "var(--color-green-light)";
        this.endMsg = "Next time will be better!";
      }
    },
    
    // show card with question and answers
    showCard(id: number) {
      this.quiz[id].playerAnswer = this.answers[this.quiz[id].question];

      this.show = true;
      this.activeCard = this.quiz[id];
    },
    
    // hide card with question and answers
    hideCard() {
      this.show = false;
    },
  },
  beforeMount() {
    // check answers before component is mounted
    this.check_answers();
  },
  setup() {
    // get data from Vuex store
    const store = useStore();
    const quiz: Quiz[] = store.getters.quiz.results;
    const answers: Answers = store.getters.answers;
    const time: string = store.getters.time;

    // IF quiz is empty, go to home page
    if (quiz.length === 0)
      window.location.href = "/";

    return {
      quiz,
      answers,
      time,
    };
  },
});
</script>

<template>
  <div class="answers">
    <div class="answers-head">
      <Icon icon="fluent:trophy-48-filled" height="100" class="trophy" />
      <p>{{ endMsg }}</p>
      <br />
      <p>Your score is: {{ percents }}%</p>
      <p>Your time: {{ time }}</p>
    </div>
    <section class="answers-questions">
      <div
        v-for="question in quiz"
        :key="question.question"
        class="answers-card"
        v-bind:class="{
          correct: check_answer(question.question),
          incorrect: !check_answer(question.question),
        }"
      >
        <p>#{{ quiz.indexOf(question) + 1 }}</p>
        <div
          @click="showCard(quiz.indexOf(question))"
          v-bind:class="{
            answers_card_correct: check_answer(question.question),
            answers_card_incorrect: !check_answer(question.question),
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
  gap: 1.5rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 20vh;
}

.answers-questions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 10vh;
}

.answers-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.2rem;
  svg path {
    color: v-bind(trophyColor);
  }
}

.answers-card {
  display: flex;
  font-size: 1rem;
  gap: 1rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &.correct {
    color: rgb(207, 207, 207);
  }

  &.incorrect {
    color: var(--color-green-darker);
    // color: #fff;
  }

  .answers-card-incorrect {
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
  .answers-card-correct {
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

  .answers-card-incorrect,
  .answers-card-correct {
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

// responsive design

@media screen and (min-width: 1024px) {
  .answers {
    width: 70%;
  }
  .answer-icon {
    height: 2rem;
    width: 5vw;
  }
  .answers-questions {
    max-width: 90%;
  }
  .answers-head {
    font-size: 1.2rem;
    svg {
      height: 5rem;
    }
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  .answers {
    width: 100%;
  }
  .answer-icon {
    height: 2rem;
    width: 8vw;
  }
  .answers-questions {
    max-width: 60%;
  }
  .answers-head {
    font-size: 1.2rem;
    svg {
      height: 5rem;
    }
  }
}

@media screen and (max-width: 767px) {
  .answers {
    width: 100%;
  }
  .answer-icon {
    height: 2rem;
    width: 17vw;
  }
  .answers-questions {
    max-width: 90%;
  }
  .answers-head {
    font-size: 1.2rem;
    svg {
      height: 5rem;
    }
  }
}
</style>
