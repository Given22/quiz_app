<!-- Footer component for showing time and Progress information -->

<script lang="ts">
interface cssVars {
  [key: string]: string;
}

export default {
  props: ["time", "answers", "questions"],
  computed: {
    cssVars(): cssVars {
      return {
        "--width": (this.answers / this.questions) * 100 + "%",
      };
    },
  },
};
</script>

<template>
  <div class="Footer">
    <span class="ProgressBar" :style="cssVars"></span>
    <div class="FooterBody">
      <p class="Time">{{ time }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: var(--color-green-light);

  height: 2.5rem;
  .ProgressBar {
    position: absolute;
    top: -0.3rem;
    left: 0;
    width: var(--width);
    transition: width 0.3s ease-out;
    height: 0.3rem;
    background-color: var(--color-yellow);
  }
  .FooterBody {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    padding: 0 1rem;
    .Time {
      font-size: 1.1rem;
      font-weight: bold;
      color: var(--color-green-dark);
    }
  }
}
</style>
