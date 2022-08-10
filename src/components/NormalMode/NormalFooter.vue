<!-- Footer component for showing time and progress information -->

<script lang="ts">
interface cssVars {
  [key: string]: string;
}

export default {
  props: ["time", "answers", "questions"],
  computed: {
    cssVars(): cssVars {
      return {
        // @ts-ignore
        "--width": (this.answers / this.questions) * 100 + "%",
      };
    },
  },
};
</script>

<template>
  <div class="footer">
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
  background-color: var(--color-green-light);

  height: 2.5rem;
  .progress-bar {
    position: absolute;
    top: -0.3rem;
    left: 0;
    width: var(--width);
    transition: all 0.3s ease-out;
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
    .time {
      font-size: 1.1rem;
      font-weight: bold;
      color: var(--color-green-dark);
    }
  }
}
</style>
