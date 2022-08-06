<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <nav id="navbar">
    <h3 class="navbar-header">Quiz App</h3>
    <div class="navbar-button">
      <a class="navbar-button__link" href="/">Next Quiz</a>
    </div>
  </nav>

  <RouterView />
</template>

<style lang="scss">
#navbar {
  padding: 20px;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 0;
  z-index: 5;
}
.navbar-header {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-yellow);
}
.navbar-button {
  display: flex;
  align-items: center;
  background-color: var(--color-yellow);
  border-radius: 10px;
  font-weight: bold;
  box-shadow: 0px 5px 0px rgba(233, 196, 106, 0.3),
    3px 10px 5px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: translateY(5px);
    box-shadow: 0px 0px 0px rgba(233, 196, 106, 0.25),
      0px 0px 0px rgba(0, 0, 0, 0.25);
  }
  .navbar-button__link {
    color: var(--color-green-dark);
    font-size: 1.3rem;
    font-weight: bold;
    text-decoration: none;
    padding: 10px;
    transition: all 0.3s ease-in-out;
    font-family: "Righteous";
    font-style: normal;
    font-weight: 400;
    font-size: 28px;
    line-height: 35px;
    display: flex;
    align-items: center;
    text-align: center;
    &:hover {
      color: var(--color-green-light);
    }
  }
}

@media screen and (min-width: 1024px) {
  #navbar {
    width: 80%;
    left: 50%;
    transform: translateX(-50%);
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  #navbar {
    width: 90%;
    left: 50%;
    transform: translateX(-50%);
  }
  .navbar-header {
    font-size: 1.7rem;
  }
  .navbar-button {
    .navbar-button__link {
      text-decoration: none;
      padding: 5px 30px;
      font-weight: 400;
      font-size: 20px;
      line-height: 35px;
    }
  }
}

@media screen and (max-width: 767px) {
  .navbar-header {
    font-size: 1.7rem;
  }
  .navbar-button {
    .navbar-button__link {
      text-decoration: none;
      padding: 5px 30px;
      font-weight: 400;
      font-size: 20px;
      line-height: 35px;
    }
  }
}
</style>
