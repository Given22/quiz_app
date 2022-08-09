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
  height: 100vh;
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
    max-width: 80%;
  }

  .card-body {
    border-radius: 6px;
    padding: 1rem;
    margin-top: 1rem;
    font-size: 1.5rem;
    width: 100%;
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  .card {
    border-radius: 10px;
    max-width: 90%;
    max-height: 80%;
    font-size: 1.2rem;
    padding: 2rem;
  }

  .card-body {
    border-radius: 6px;
    padding: 1rem;
    margin-top: 1rem;
    font-size: 1.3rem;
    width: 100%;
  }
}

@media screen and (max-width: 767px) {
  .card {
    padding: 2rem;
    font-size: 1rem;
    border-radius: 10px;
    width: 85%;
  }

  .card-body {
    border-radius: 6px;
    font-size: 1rem;
    padding: 1rem;
    margin-top: 1rem;
    width: 100%;
  }
}
</style>
