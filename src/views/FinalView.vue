<!-- Final Page with answer and player stats -->

<script lang="ts">
import { useStore } from "vuex";
import { defineComponent } from "vue";
import { decode } from "html-entities";
import { saveState, getState } from "@/stores/localStorage";

import NavBar from "@/components/NavBar.vue";
import AnswersSection from "@/components/Final/AnswersSection.vue";
import StatsSection from "@/components/Final/StatsSection.vue";

import LoadingScreen from "@/components/LoadingScreen.vue";

import { convert_ms_to_time } from "@/utils/functions";

import type { Quiz, Answers, Statistic } from "@/types/types";

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
    AnswersSection,
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

    // check if answer is correct
    check_answer(question: string) {
      const que = this.quiz.find((q) => q.question === question);
      if (!this.answers[question]) return;
      if (que && que.correct_answer === this.answers[question]) return true;
      return false;
    },

    // check all questions and calculate percentage of correct answers
    check_answers() {
      this.quiz.forEach((question: Quiz) => {
        if (this.check_answer(question.question)) {
          this.correctAnswers++;
        }
      });

      console.log(this.correctAnswers, this.quiz.length);

      // calculate percentage of correct answers
      return (this.percents = Math.floor(
        (this.correctAnswers / this.quiz.length) * 100
      ));
    },

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

    //Conver data to statistics
    create_new_statistic() {
      const store = useStore();
      const stats = store.getters.stats;
      if (stats.mode === "timer") {
        const quiz = store.getters.quiz;

        let avg_time = 0;
        quiz.results.forEach((q: Quiz) => {
          avg_time += q.playerTime ? q.playerTime : 0;
        });
        avg_time = Math.round(avg_time / quiz.results.length);

        return {
          mode: stats.mode,
          date: new Date(),
          percents: this.check_answers(),
          questions_number: stats.questionNumber,
          category: stats.category,
          difficulty: stats.difficulty,
          type: stats.type,
          avg_time: avg_time,
          timer_timeout: stats.timerTimeout,
        };
      }
      return {
        mode: stats.mode,
        date: new Date(),
        percents: this.check_answers(),
        questions_number: stats.questionNumber,
        category: stats.category,
        difficulty: stats.difficulty,
        type: stats.type,
        time: store.getters.time,
      };
    },
  },
  mounted() {
    const newStatistic: Statistic = this.create_new_statistic();
    const storage = getState("previous");
    if (storage) {
      const previous = JSON.parse(storage);
      this.stats = [newStatistic, ...previous];
    } else {
      this.stats = [newStatistic];
    }
    console.log(newStatistic);

    saveState("previous", JSON.stringify(this.stats));
    this.isLoading = false;
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
  <div v-if="isLoading">
    <LoadingScreen />
  </div>
  <div v-if="!isLoading">
    <NavBar />
    <AnswersSection />
    <StatsSection />
  </div>
</template>

<style lang="scss">
.Answers {
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

.AnswersQuestions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 10vh;
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
  font-size: 1rem;
  gap: 1rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &.Correct {
    color: rgb(207, 207, 207);
  }

  &.Incorrect {
    color: var(--color-green-darker);
    // color: #fff;
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

.AnswerIcon {
  height: 4rem;
  width: 6rem;
}

// responsive design

@media screen and (min-width: 1024px) {
  .Answers {
    width: 70%;
  }
  .AnswerIcon {
    height: 2rem;
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
    height: 2rem;
    width: 8vw;
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
  }
  .AnswerIcon {
    height: 2rem;
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
