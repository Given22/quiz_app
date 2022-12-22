<template>
  <p class="HomeHeader">Quiz App</p>
  <main id="Home">
    <div class="HomeButton">
      <a class="HomeButtonLink" href="/form">Start Quiz</a>
    </div>
  </main>
</template>

<style lang="scss">
#Home {
  width: 100vw;
  height: 100vh;
  gap: 20px;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
}
.HomeHeader {
  font-size: 3rem;
  font-weight: bold;
  color: var(--color-yellow);
  position: absolute;
  top: 1rem;
  width: 100%;
  text-align: center;
}
.HomeButton {
  display: flex;
  align-items: center;
  background-color: var(--color-yellow);
  border-radius: 10px;
  font-weight: bold;
  box-shadow: 0px 5px 0px rgba(233, 196, 106, 0.3),
    3px 10px 5px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  &:hover {
    transform: translateY(5px);
    box-shadow: 0px 0px 0px rgba(233, 196, 106, 0.25),
      0px 0px 0px rgba(0, 0, 0, 0.25);
  }
  .HomeButtonLink {
    color: var(--color-green-dark);
    font-size: 2rem;
    font-weight: bold;
    text-decoration: none;
    padding: 10px;
    transition: color 0.3s ease-in-out;
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
  .HomeHeader {
    font-size: 3rem;
  }
  .HomeButton {
    .HomeButtonLink {
      text-decoration: none;
      padding: 5px 45px;
      font-weight: 400;
      font-size: 1.8rem;
      line-height: 2.3rem;
    }
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  .HomeHeader {
    font-size: 3rem;
  }
  .HomeButton {
    .HomeButtonLink {
      text-decoration: none;
      padding: 5px 45px;
      font-weight: 400;
      font-size: 1.8rem;
      line-height: 2.3rem;
    }
  }
}

@media screen and (max-width: 767px) {
  .HomeHeader {
    font-size: 3rem;
  }
  .HomeButton {
    .HomeButtonLink {
      text-decoration: none;
      padding: 5px 50px;
      font-weight: 400;
      font-size: 2rem;
      line-height: 2.5rem;
    }
  }
}
</style>
