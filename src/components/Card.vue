<script lang="ts">
import { defineComponent } from "vue";
import { decode } from "html-entities";

interface Quiz {
  answers?: string[];
  category: string;
  correct_answer: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

export default defineComponent({
  methods: {
    decode(str: string) {
      return decode(str);
    },
  },
  props: {
    question: Object,
  },
});
</script>

<template>
  <div class="card-back">
    <div class="card">
      <h2>{{ decode(question.question) }}</h2>
      <div class="card-body">
        <div class="card-text" v-for="answer in question.answers">
          <p
            v-bind:class="{
              correct: answer === question.correct_answer,
              playerAnswer: answer === question.playerAnswer,
            }"
          >
            {{ decode(answer) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.card-back {
  position: absolute;
  background-color: #2646537c;
  backdrop-filter: blur(10px);
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card {
  background-color: var(--color-green-light);
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 2px 10px 5px rgba(0, 0, 0, 0.25);
  color: var(--color-green-dark);
}

.card-body {
  background-color: var(--color-green-dark);
  color: rgb(180, 180, 180);
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
  font-size: 1.5rem;
}

.correct {
  color: var(--color-green-light);
  &.playerAnswer {
    color: var(--color-yellow);
  }
}

.playerAnswer {
  color: var(--color-orange);
}

@media screen and (min-width: 1024px) {
  .card {
    padding: 3rem;
    border-radius: 10px;
    max-width: 60%;
  }

  .card-body {
    border-radius: 6px;
    padding: 1rem;
    margin-top: 1rem;
    font-size: 1.5rem;
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  .card {
    padding: 3rem;
    border-radius: 10px;
  }

  .card-body {
    border-radius: 6px;
    padding: 1rem;
    margin-top: 1rem;
    font-size: 1.5rem;
  }
}

@media screen and (max-width: 767px) {
  .card {
    padding: 3rem;
    border-radius: 10px;
    max-width: 85%;
  }

  .card-body {
    border-radius: 6px;
    padding: 1rem;
    margin-top: 1rem;
    font-size: 1.5rem;
  }
}
</style>
