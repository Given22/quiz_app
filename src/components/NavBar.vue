<template>
  <nav id="navbar">
    <a class="NavbarHeader" href="/home">Quiz App</a>
    <div class="NavbarButton">
      <a class="NavbarButtonLink" href="/form">Next Quiz</a>
    </div>
  </nav>
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
.NavbarHeader {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-yellow);
  text-decoration-line: none;
}
.NavbarButton {
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
  .NavbarButtonLink {
    color: var(--color-green-dark);
    font-size: 1.3rem;
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
  #navbar {
    width: 80%;
    left: 50%;
    transform: translateX(-50%);
  }
  .NavbarHeader {
    font-size: 1.4rem;
  }
  .NavbarButton {
    .NavbarButtonLink {
      text-decoration: none;
      padding: 5px 30px;
      font-weight: 400;
      font-size: 1.3rem;
      line-height: 2rem;
    }
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  #navbar {
    width: 90%;
    left: 50%;
    transform: translateX(-50%);
    padding: 1rem;
  }
  .NavbarHeader {
    font-size: 1.3rem;
  }
  .NavbarButton {
    .NavbarButtonLink {
      text-decoration: none;
      padding: 5px 30px;
      font-weight: 400;
      font-size: 1rem;
      line-height: 1.5rem;
    }
  }
}

@media screen and (max-width: 767px) {
  .NavbarHeader {
    font-size: 1.7rem;
  }
  .NavbarButton {
    .NavbarButtonLink {
      text-decoration: none;
      padding: 5px 30px;
      font-weight: 400;
      font-size: 1.2rem;
      line-height: 1.5rem;
    }
  }
}
</style>
