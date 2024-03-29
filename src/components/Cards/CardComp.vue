<!-- Card component for showing the questions with a answers -->

<script lang="ts">
import { defineComponent } from "vue";
import { decode_text, convert_ms_to_time } from "@/utils/functions";

export default defineComponent({
  methods: {
    decode: decode_text,
    convert: convert_ms_to_time,
  },
  props: {
    question: Object,
  },
});
</script>

<template>
  <div class="CardBack">
    <div class="Card">
      <p>{{ decode(question?.question) }}</p>
      <div class="CardBody">
        <p
          class="CardText"
          v-for="answer in question?.answers"
          v-bind:class="{
            Correct: answer === question?.correct_answer,
            PlayerAnswer: answer === question?.playerAnswer,
          }"
          v-bind:key="answer"
        >
          {{ decode(answer) }}
        </p>
      </div>
      <p v-if="question?.playerTime" class="CardTime">
        Your time on this question:
        {{ convert(question.playerTime) }} s
      </p>
    </div>
  </div>
</template>

<style lang="scss">
.CardBack {
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

.Card {
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

.CardBody {
  background-color: var(--color-green-dark);
  color: rgb(180, 180, 180);
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
  font-size: 1.5rem;
}

.CardTime {
  margin-top: 0.5rem;
}

.Correct {
  color: var(--color-green-light);
  &.PlayerAnswer {
    color: var(--color-yellow);
  }
}

.PlayerAnswer {
  color: var(--color-orange);
}

@media screen and (min-width: 1024px) {
  .Card {
    font-size: 1rem;
    max-width: 80%;
  }

  .CardBody {
    border-radius: 6px;
    padding: 1rem;
    font-size: 1rem;
    width: 100%;
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  .Card {
    max-width: 90%;
    max-height: 80%;
    font-size: 1rem;
  }

  .CardBody {
    border-radius: 6px;
    padding: 1rem;
    font-size: 1rem;
    width: 100%;
  }
}

@media screen and (max-width: 767px) {
  .Card {
    font-size: 1rem;
    width: 85%;
  }

  .CardBody {
    border-radius: 6px;
    font-size: 1rem;
    padding: 1rem;
    width: 100%;
  }
}
</style>
