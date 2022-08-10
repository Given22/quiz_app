<!-- Footer component for showing time and progress information -->

<script lang="ts">
interface cssVars {
  [key: string]: string;
}

export default {
  props: ["time", "answers", "questions", 'quiz_lenght', 'question_time'],
  computed: {
    cssVars(): cssVars {  
      return {
        // @ts-ignore
        "--width": (this.answers / this.questions) * 100 + "%",
        // @ts-ignore
        "--width-timer": ((this.question_time + 1000) / this.quiz_lenght) * 100 + "%",
      };
    },
  },
};
</script>

<template>
  <div class="footer" :style="cssVars">
    <span class="progress-bar" :style="cssVars"></span>
    <div class="footer-body">
      <p class="time">{{ time }}</p>
    </div>
  </div>
</template>

<style lang="scss">
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: rgba($color: #2A9D8F, $alpha: 0.4);
  height: 2.5rem;
  &:after{
    content: "";
    height: 2.5rem;
    position: relative;
    top: -2.5rem;
    width: var(--width-timer);
    display: flex;
    z-index: -1;
    transition: all 1s linear;
    background-color: var(--color-green-light);
  }
  .progress-bar {
    position: absolute;
    top: -0.3rem;
    left: 0;
    width: var(--width);
    transition: all 1s ease-out;
    height: 0.3rem;
    background-color: var(--color-yellow);
  }
  .footer-body {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    padding: 0 1rem;
    z-index: 3;
    .time {
      font-size: 1.1rem;
      font-weight: bold;
      color: var(--color-green-dark);
    }
  }
}
</style>
