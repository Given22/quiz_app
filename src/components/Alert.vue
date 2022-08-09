<!-- Alert card component for showing error messages -->

<script lang="ts">
import { defineComponent } from "vue";
import { decode } from "html-entities";

export default defineComponent({
  props: ['msg'],
});
</script>

<template>
  <div class="alert">
      <div class="alert-card-back">
        <div class="alert-card">
          <h2>{{msg}}</h2>
        </div>
      </div>
    </div>
</template>

<style lang="scss">
.alert-card-back {
  position: fixed;
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
  z-index: 5;
}

.alert-card {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-orange);
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 2px 10px 5px rgba(0, 0, 0, 0.25);
  color: var(--color-green-dark);

}

@media screen and (min-width: 1024px) {
  .alert-card {
    padding: 3rem;
    border-radius: 10px;
    max-width: 60%;
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  .alert-card {
    padding: 3rem;
    border-radius: 10px;
    max-width: 75%;
  }
}

@media screen and (max-width: 767px) {
  .alert-card {
    padding: 3rem;
    border-radius: 10px;
    width: 85%;
  }
}
</style>
