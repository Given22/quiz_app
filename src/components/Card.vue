<!-- Card component for showing the questions with a answers -->

<script lang="ts">
import { defineComponent } from "vue";
import { decode } from "html-entities";

export default defineComponent({
  methods: {
    // decode html entities
    decode(str: string) {
      return decode(str);
    },
    
    // convert milliseconds to good looking time format
    convertMsToTime(milliseconds: number) {
      let seconds = Math.floor(milliseconds / 1000);

      return `${(seconds % 60)}.${(milliseconds % 1000).toString().slice(0, 1)}`;
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
      <p>{{ decode(question?.question) }}</p>
      <div class="card-body">
        <p
          class="card-text"
          v-for="answer in question?.answers"
          v-bind:class="{
            correct: answer === question?.correct_answer,
            playerAnswer: answer === question?.playerAnswer,
          }"
        >
          {{ decode(answer) }}
        </p>
      </div>
      <p v-if="question?.playerTime" class="card_time">
        Your time on this question: {{ convertMsToTime(question.playerTime)}} s
      </p>
    </div>
  </div>
</template>

<style lang="scss">
.card-back {
  position: fixed;
  background-color: #2646537c;
  backdrop-filter: blur(10px);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 5;
}

.card {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-green-light);
  border-radius: 10px;
  box-shadow: 2px 10px 5px rgba(0, 0, 0, 0.25);
  color: var(--color-green-dark);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  padding-bottom: 0.5rem;
}

.card-body {
  background-color: var(--color-green-dark);
  color: rgb(180, 180, 180);
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
  font-size: 1.5rem;
}

.card_time{
  margin-top: 0.5rem;
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
    font-size: 1rem;
    max-width: 80%;
  }

  .card-body {
    border-radius: 6px;
    padding: 1rem;
    font-size: 1rem;
    width: 100%;
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  .card {
    max-width: 90%;
    max-height: 80%;
    font-size: 1rem;
  }

  .card-body {
    border-radius: 6px;
    padding: 1rem;
    font-size: 1rem;
    width: 100%;
  }
}

@media screen and (max-width: 767px) {
  .card {
    font-size: 1rem;
    width: 85%;
  }

  .card-body {
    border-radius: 6px;
    font-size: 1rem;
    padding: 1rem;
    width: 100%;
  }
}
</style>
