<!-- Loading screen when data is loaded -->

<template>
  <div class="LoadingScreen">
    <Icon icon="eos-icons:loading" color="var(--color-yellow)" height="8vh" />
  </div>
</template>

<script lang="ts">
  import { Icon } from "@iconify/vue";
  import { defineComponent } from "vue";
  
  export default defineComponent({
    components: {
      Icon,
    },
  })
</script>

<style lang="scss">
  .LoadingScreen{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
  }
</style>